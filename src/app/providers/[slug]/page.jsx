import { cache } from "react";
import { notFound } from "next/navigation";
import { url } from "../../service/url";
import { slugify } from "../../utils/slugify";
import CompanyPageClient from "../../companyPage/[companyId]/CompanyPageClient";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://treasurymap-v2-production.up.railway.app";

// React.cache() deduplicates the fetch within a single request · generateMetadata
// and the page Layout call this function but only ONE network request is made.
const fetchCompanyBySlug = cache(async (slug) => {
  try {
    const res = await fetch(`${url}/api/v1/companies/by-slug/${slug}`, {
      next: { revalidate: 300 }, // ISR: revalidate every 5 min
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
});

// Reference lists fetched once (cached, long ISR) and mapped server-side so
// sub-category & country NAMES land in the SSR HTML (good for SEO + reliable).
const fetchRefList = cache(async (path) => {
  try {
    const res = await fetch(`${url}/api/v1/${path}`, { next: { revalidate: 86400 } });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
});

async function resolveNames(ids, path) {
  if (!Array.isArray(ids) || !ids.length) return [];
  const list = await fetchRefList(path);
  const byId = new Map(list.map((x) => [x.id, x.name]));
  return ids.map((id) => byId.get(id)).filter(Boolean);
}

// Q&A: question bodies (cached) + this company's answers (array, index→question).
const fetchQuestions = cache(async () => {
  try {
    const res = await fetch(`${url}/api/v1/questions`, { next: { revalidate: 86400 } });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : data?.data || [];
  } catch {
    return [];
  }
});

async function fetchQa(companyId) {
  try {
    const [questions, ansRes] = await Promise.all([
      fetchQuestions(),
      fetch(`${url}/api/v1/answers/${companyId}`, { next: { revalidate: 300 } }).then((r) => (r.ok ? r.json() : [])),
    ]);
    const answers = Array.isArray(ansRes) ? ansRes : [];
    return questions
      .map((q, i) => ({ question: q.body, answer: answers[i] }))
      .filter((qa) => qa.answer && String(qa.answer).trim());
  } catch {
    return [];
  }
}

// ── Metadata ──────────────────────────────────────────────────────────────────
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const company = await fetchCompanyBySlug(slug);
  if (!company) return {};

  const name    = company.name || slug;
  const rawDesc = (company.description || "")
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .replace(/^N\/A.*/i, "")
    .trim();
  // Prefer the first sentence; fall back to a generated description
  let description;
  if (rawDesc.length > 20) {
    const firstSentence = rawDesc.split(/(?<=[.!?])\s/)[0];
    description = (firstSentence.length > 60 && firstSentence.length < 180
      ? firstSentence
      : rawDesc.slice(0, 160)).trim();
  } else {
    description = `${name} on the TreasuryMap Treasury Technology Landscape · categories, profile, and insights.`;
  }

  const canonical = `${SITE}/providers/${slugify(name)}`;
  const image     = company.logo || undefined;

  return {
    // Bare name; the root layout's title template appends " | TreasuryMap".
    title: name,
    description,
    alternates: { canonical },
    openGraph: {
      title: `${name} | TreasuryMap`,
      description,
      url: canonical,
      type: "website",
      siteName: "TreasuryMap",
      images: image ? [{ url: image, alt: `${name} logo` }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: `${name} | TreasuryMap`,
      description,
      images: image ? [image] : undefined,
    },
  };
}

// ── JSON-LD structured data ───────────────────────────────────────────────────
function JsonLd({ company, slug }) {
  const name     = company.name || slug;
  const canonical = `${SITE}/providers/${slugify(name)}`;
  const rawDesc  = (company.description || "").replace(/<[^>]*>/g, "").trim();

  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name,
    description: rawDesc || undefined,
    url: company.companyWebsite && company.companyWebsite !== "N/A"
      ? company.companyWebsite
      : canonical,
    logo: company.logo || undefined,
    sameAs: company.companyWebsite && company.companyWebsite !== "N/A"
      ? [company.companyWebsite]
      : undefined,
  };

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "TreasuryMap", item: SITE },
      { "@type": "ListItem", position: 2, name: "Providers", item: `${SITE}/providers` },
      { "@type": "ListItem", position: 3, name, item: canonical },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
    </>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default async function ProviderPage({ params }) {
  const { slug } = await params;
  const company  = await fetchCompanyBySlug(slug);
  if (!company) notFound();

  // Resolve sub-category & country names + Q&A server-side (SSR'd → SEO + reliable)
  const [subcategoryNames, countryNames, qa] = await Promise.all([
    resolveNames(company.companySubcategories, "subCategories"),
    resolveNames(company.companyOffices, "countries"),
    fetchQa(company.id),
  ]);

  return (
    <>
      <JsonLd company={company} slug={slug} />
      <CompanyPageClient
        companyId={company.id}
        initialCompany={company}
        subcategoryNames={subcategoryNames}
        countryNames={countryNames}
        qa={qa}
      />
    </>
  );
}

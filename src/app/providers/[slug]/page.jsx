import { cache } from "react";
import { notFound } from "next/navigation";
import { url } from "../../service/url";
import { slugify } from "../../utils/slugify";
import CompanyPageClient from "../../companyPage/[companyId]/CompanyPageClient";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://treasurymap-v2-production.up.railway.app";

// React.cache() deduplicates the fetch within a single request — generateMetadata
// and the page Layout call this function but only ONE network request is made.
const fetchCompanyBySlug = cache(async (slug) => {
  try {
    const res = await fetch(`${url}/api/v1/companies/by-slug/${slug}`, {
      next: { revalidate: 3600 }, // ISR: revalidate every hour (company data rarely changes)
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
});

// ── Metadata ──────────────────────────────────────────────────────────────────
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const company = await fetchCompanyBySlug(slug);
  if (!company) return {};

  const name        = company.name || slug;
  const rawDesc     = (company.description || "").replace(/<[^>]*>/g, "").trim();
  const description = rawDesc.length > 10
    ? rawDesc.slice(0, 200)
    : `${name} is listed on the TreasuryMap Treasury Technology Landscape.`;

  const canonical = `${SITE}/providers/${slugify(name)}`;
  const image     = company.logo || undefined;

  return {
    title: `${name} | TreasuryMap`,
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

  return (
    <>
      <JsonLd company={company} slug={slug} />
      <CompanyPageClient companyId={company.id} initialCompany={company} />
    </>
  );
}

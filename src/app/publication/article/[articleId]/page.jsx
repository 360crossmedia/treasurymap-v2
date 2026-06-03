import { cache } from "react";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import PublicationView from "../../../components/PublicationView";
import { url } from "../../../service/url";
import { slugify, idFromPublicationSlug } from "../../../utils/slugify";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://treasurymap-v2-production.up.railway.app";

const getJson = async (path, revalidate) => {
  try {
    const r = await fetch(`${url}/api/v1/${path}`, { next: { revalidate } });
    return r.ok ? r.json() : null;
  } catch { return null; }
};

const fetchArticle  = cache((id) => getJson(`articles/${id}`, 300));
const fetchCompany  = cache((id) => (id ? getJson(`companies/${id}`, 3600) : null));
const fetchCategory = cache((id) => (id ? getJson(`categories/${id}`, 86400) : null));
const fetchByCat    = cache((id) => (id ? getJson(`publications/${id}`, 300) : null));
const fetchCompanies = cache(() => getJson(`companies`, 3600));

export async function generateMetadata({ params }) {
  const { articleId } = await params;
  const id = idFromPublicationSlug(articleId);
  const article = await fetchArticle(id);
  if (!article) return {};
  const company = await fetchCompany(article.companyId);
  const cs = slugify(company?.name);
  const canonical = `${SITE}/publication/article/${cs ? `${cs}-${id}` : id}`;
  const title = `${article.title}${company?.name ? ` — ${company.name}` : ""} | TreasuryMap`;
  const description = (article.introduction || article.title || "").slice(0, 200);
  const image = article.coverImage;
  return {
    title: { absolute: title },
    description,
    alternates: { canonical },
    openGraph: {
      title: article.title, description, url: canonical, type: "article",
      siteName: "TreasuryMap", images: image ? [{ url: image }] : undefined,
    },
    twitter: { card: "summary_large_image", title: article.title, description, images: image ? [image] : undefined },
  };
}

function JsonLd({ article, company, id }) {
  const cs = slugify(company?.name);
  const data = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.introduction || undefined,
    image: article.coverImage || undefined,
    datePublished: article.createdAt || undefined,
    dateModified: article.updatedAt || undefined,
    author: company?.name ? { "@type": "Organization", name: company.name } : undefined,
    publisher: { "@type": "Organization", name: "TreasuryMap" },
    mainEntityOfPage: `${SITE}/publication/article/${cs ? `${cs}-${id}` : id}`,
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

export default async function ArticlePage({ params }) {
  const { articleId } = await params;
  const id = idFromPublicationSlug(articleId);
  const article = await fetchArticle(id);
  const company = article ? await fetchCompany(article.companyId) : null;
  const catId   = company?.maincategory?.[0];

  const [category, related, companies] = await Promise.all([
    fetchCategory(catId),
    fetchByCat(catId),
    fetchCompanies(),
  ]);

  const companyNameById = Object.fromEntries((companies || []).map((c) => [c.id, c.name]));
  const relatedList = (related || [])
    .filter((r) => r && r.coverImage && String(r.id) !== String(id))
    .slice(0, 4);

  return (
    <>
      {article && <JsonLd article={article} company={company} id={id} />}
      <Navbar buttonLabel="Log In" />
      <PublicationView
        publication={article}
        company={company}
        category={category}
        related={relatedList}
        companyNameById={companyNameById}
        isVideo={false}
      />
      <Footer />
    </>
  );
}

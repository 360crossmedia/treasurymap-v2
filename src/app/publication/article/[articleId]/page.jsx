import { cache } from "react";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import InsightsNavbar from "../../../components/InsightsNavbar";
import Article from "../../../components/Article";
import { url } from "../../../service/url";
import { slugify, idFromPublicationSlug } from "../../../utils/slugify";
import styles from "../../../styles/Insights.module.css";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://treasurymap-v2-production.up.railway.app";

const fetchArticle = cache(async (id) => {
  try {
    const r = await fetch(`${url}/api/v1/articles/${id}`, { next: { revalidate: 300 } });
    return r.ok ? r.json() : null;
  } catch { return null; }
});

const fetchCompany = cache(async (id) => {
  if (!id) return null;
  try {
    const r = await fetch(`${url}/api/v1/companies/${id}`, { next: { revalidate: 3600 } });
    return r.ok ? r.json() : null;
  } catch { return null; }
});

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

  return (
    <>
      {article && <JsonLd article={article} company={company} id={id} />}
      <Navbar buttonLabel="Log In" />
      <div className={styles.page}>
        <InsightsNavbar />
        <Article articleId={id} />
      </div>
      <Footer />
    </>
  );
}

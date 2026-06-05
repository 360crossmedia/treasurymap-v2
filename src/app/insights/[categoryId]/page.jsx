import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import InsightsNavbar from "../../components/InsightsNavbar";
import InsightsWithCategory from "../../components/InsightsWithCategory";
import styles from "../../styles/Insights.module.css";
import { url } from "../../service/url";
import { formatCategoryName } from "../../utils";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://treasurymap-v2-production.up.railway.app";

async function getJson(path) {
  try {
    const res = await fetch(`${url}/api/v1/${path}`, { next: { revalidate: 300 } });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

async function getCategoryData(categoryId) {
  const [category, listRaw, companiesRaw] = await Promise.all([
    getJson(`categories/${categoryId}`),
    getJson(`publications/${categoryId}`),
    getJson("companies"),
  ]);
  const companies = Array.isArray(companiesRaw) ? companiesRaw : companiesRaw?.data || [];
  const list = Array.isArray(listRaw) ? listRaw : [];
  return {
    category,
    pubs: list.filter((p) => p?.live && p?.coverImage),
    companyById: Object.fromEntries(companies.map((c) => [c.id, c.name])),
  };
}

export async function generateMetadata({ params }) {
  const { categoryId } = await params;
  const category = await getJson(`categories/${categoryId}`);
  const name = category?.name ? formatCategoryName(category.name) : "Insights";
  const description = `Treasury technology insights on ${name} — articles, videos and research from the TreasuryMap community.`;
  const canonical = `${SITE_URL}/insights/${categoryId}`;
  return {
    title: `${name} insights`,
    description,
    alternates: { canonical },
    openGraph: {
      title: `${name} insights | TreasuryMap`,
      description,
      url: canonical,
      type: "website",
      siteName: "TreasuryMap",
    },
  };
}

export default async function InsightsCategoryPage({ params }) {
  const { categoryId } = await params;
  const { category, pubs, companyById } = await getCategoryData(categoryId);
  return (
    <>
      <Navbar buttonLabel="Log In" />
      <div className={styles.page}>
        <header className={styles.header}>
          <span className={styles.eyebrow}>// Insights</span>
          <h1 className={styles.heading}>Treasury technology insights</h1>
        </header>
        <InsightsNavbar categoryId={categoryId} />
        <InsightsWithCategory
          categoryId={categoryId}
          initialCategory={category}
          initialPubs={pubs}
          initialCompanyById={companyById}
        />
      </div>
      <Footer />
    </>
  );
}

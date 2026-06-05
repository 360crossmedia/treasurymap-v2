import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import InsightsNavbar from "../components/InsightsNavbar";
import Insights from "../components/Insights";
import styles from "../styles/Insights.module.css";
import { url } from "../service/url";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://treasurymap-v2-production.up.railway.app";

async function getJson(path) {
  try {
    const res = await fetch(`${url}/api/v1/${path}`, { next: { revalidate: 300 } });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : data?.data || [];
  } catch {
    return [];
  }
}

// Same ordering the client used (featured first in admin slot order, then the
// rest newest-first) — computed server-side so the list lands in the SSR HTML.
async function getInsightsData() {
  const [featured, all, companies] = await Promise.all([
    getJson("mainPublications/full"),
    getJson("publications"),
    getJson("companies"),
  ]);
  const companyById = Object.fromEntries((companies || []).map((c) => [c.id, c.name]));
  const key = (p) => `${p.url ? "v" : "a"}-${p.id}`;
  const seen = new Set();
  const orderedFeatured = [];
  for (const p of featured || []) {
    if (!p || !p.coverImage || seen.has(key(p))) continue;
    seen.add(key(p));
    orderedFeatured.push(p);
  }
  const rest = (all || [])
    .filter((p) => p && p.coverImage && !seen.has(key(p)))
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  return { pubs: [...orderedFeatured, ...rest], companyById };
}

export const metadata = {
  title: "Insights",
  description:
    "Articles, videos and research on treasury technology from the TreasuryMap community.",
  alternates: { canonical: `${SITE_URL}/insights` },
  openGraph: {
    title: "Insights | TreasuryMap",
    description:
      "Articles, videos and research on treasury technology from the TreasuryMap community.",
    url: `${SITE_URL}/insights`,
    type: "website",
    siteName: "TreasuryMap",
  },
};

export default async function InsightsPage() {
  const { pubs, companyById } = await getInsightsData();
  return (
    <>
      <Navbar buttonLabel="Log In" />
      <div className={styles.page}>
        <header className={styles.header}>
          <span className={styles.eyebrow}>// Insights</span>
          <h1 className={styles.heading}>Treasury technology insights</h1>
          <p className={styles.sub}>Articles, videos and research from the TreasuryMap community.</p>
        </header>
        <InsightsNavbar />
        <Insights initialPubs={pubs} initialCompanyById={companyById} />
      </div>
      <Footer />
    </>
  );
}

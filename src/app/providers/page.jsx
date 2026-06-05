import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { url } from "../service/url";
import { providerHref } from "../utils/slugify";
import styles from "../styles/providersIndex.module.css";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://treasurymap-v2-production.up.railway.app";

// Live vendors only (the public set). SSR'd as real <a> links so this page is
// a crawlable hub into every /providers/[slug] page (the homepage map has no
// crawlable links). ISR every 5 min.
async function fetchLiveCompanies() {
  try {
    const res = await fetch(`${url}/api/v1/companies`, { next: { revalidate: 300 } });
    if (!res.ok) return [];
    const data = await res.json();
    const arr = Array.isArray(data) ? data : data?.data || [];
    return arr.filter((c) => c && c.live && c.name && String(c.name).trim());
  } catch {
    return [];
  }
}

export async function generateMetadata() {
  const canonical = `${SITE_URL}/providers`;
  const description =
    "Browse every treasury technology provider on the TreasuryMap landscape — solutions, integrators and data vendors, A to Z.";
  return {
    title: "Providers",
    description,
    alternates: { canonical },
    openGraph: {
      title: "Providers | TreasuryMap",
      description,
      url: canonical,
      type: "website",
      siteName: "TreasuryMap",
    },
  };
}

export default async function ProvidersIndex() {
  const companies = await fetchLiveCompanies();
  const sorted = [...companies].sort((a, b) =>
    String(a.name).trim().localeCompare(String(b.name).trim())
  );

  // Group alphabetically; digits/symbols fall under "#".
  const groups = {};
  for (const c of sorted) {
    const first = String(c.name).trim()[0].toUpperCase();
    const key = /[A-Z]/.test(first) ? first : "#";
    (groups[key] = groups[key] || []).push(c);
  }
  const letters = Object.keys(groups).sort();

  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "TreasuryMap Providers",
    numberOfItems: sorted.length,
    itemListElement: sorted.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: String(c.name).trim(),
      url: `${SITE_URL}${providerHref(c)}`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }}
      />
      <Navbar buttonLabel="Sign up" />
      <main className={styles.wrap}>
        <header className={styles.head}>
          <h1 className={styles.title}>Providers</h1>
          <p className={styles.sub}>
            Every treasury technology provider on the TreasuryMap landscape
            {sorted.length ? ` — ${sorted.length} and counting.` : "."}
          </p>
        </header>

        {letters.map((L) => (
          <section key={L} className={styles.group}>
            <h2 className={styles.letter}>{L}</h2>
            <ul className={styles.list}>
              {groups[L].map((c) => (
                <li key={c.id}>
                  <a className={styles.link} href={providerHref(c)}>
                    {String(c.name).trim()}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </main>
      <Footer />
    </>
  );
}

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import bnpLogo from "../assets/BNP_logo.png";
import intensumLogo from "../assets/intensum-logo.jpg";
import kantoxLogo from "../assets/Kantox-logo.png";
import styles from "./partners.module.css";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://treasurymap-v2-production.up.railway.app";

// Official partners. Editorial content · edit here to change the showcase.
// `featured` (optional) is a list of { title, href } shown under the card; leave
// it empty to hide the section until the partner has content to highlight.
const PARTNERS = [
  {
    name: "BNP Paribas",
    tag: "Banking partner",
    logo: bnpLogo,
    website: "https://cib.bnpparibas",
    description:
      "A leading European bank. Its corporate and institutional banking arm supports corporate treasurers with cash management, financing, FX and payments across a global network.",
    featured: [],
  },
  {
    name: "Intensum",
    tag: "Treasury technology integrator",
    logo: intensumLogo,
    website: "https://www.intensum.com",
    description:
      "Treasury and finance transformation specialists. Intensum helps corporates select, implement and optimise treasury and SAP finance technology across Europe.",
    featured: [],
  },
  {
    name: "Kantox",
    tag: "Currency Management Automation",
    logo: kantoxLogo,
    website: "https://www.kantox.com",
    description:
      "Kantox automates the entire FX workflow, from exposure capture to hedging and execution, so treasurers remove currency risk without manual effort.",
    featured: [],
  },
];

export const metadata = {
  title: "Partners",
  description:
    "The official partners behind TreasuryMap: BNP Paribas, Intensum and Kantox, supporting corporate treasurers across Europe.",
  alternates: { canonical: "/partners" },
  openGraph: {
    title: "Partners | TreasuryMap",
    description:
      "The official partners behind TreasuryMap, supporting corporate treasurers across Europe.",
    url: `${SITE_URL}/partners`,
    type: "website",
  },
};

const JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Partners", item: `${SITE_URL}/partners` },
      ],
    },
    {
      "@type": "CollectionPage",
      "@id": `${SITE_URL}/partners`,
      name: "TreasuryMap partners",
      isPartOf: { "@id": `${SITE_URL}/#website` },
      mainEntity: {
        "@type": "ItemList",
        numberOfItems: PARTNERS.length,
        itemListElement: PARTNERS.map((p, i) => ({
          "@type": "ListItem",
          position: i + 1,
          item: { "@type": "Organization", name: p.name, url: p.website },
        })),
      },
    },
  ],
};

export default function PartnersPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
      />
      <Navbar buttonLabel="Log In" />

      <main className={styles.page}>
        <section className={styles.hero}>
          <div className={styles.inner}>
            <span className={styles.eyebrow}>// Our partners</span>
            <h1 className={styles.h1}>The partners behind TreasuryMap</h1>
            <p className={styles.lead}>
              TreasuryMap is supported by a small group of official partners who share our mission of
              making treasury technology easier to navigate for European corporates.
            </p>
          </div>
        </section>

        <section className={styles.body}>
          <div className={styles.inner}>
            <div className={styles.grid}>
              {PARTNERS.map((p) => (
                <article key={p.name} className={styles.card}>
                  <span className={styles.logoBox}>
                    <img src={p.logo.src} alt={`${p.name} logo`} />
                  </span>
                  <span className={styles.tag}>{p.tag}</span>
                  <h2 className={styles.name}>{p.name}</h2>
                  <p className={styles.desc}>{p.description}</p>
                  <a className={styles.site} href={p.website} target="_blank" rel="noopener noreferrer">
                    Visit website &rarr;
                  </a>
                  {p.featured?.length ? (
                    <div className={styles.featured}>
                      <span className={styles.fLabel}>Featured content</span>
                      <ul>
                        {p.featured.map((f) => (
                          <li key={f.href}>
                            <a href={f.href}>{f.title}</a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.foot}>
          <div className={styles.inner}>
            Interested in becoming a TreasuryMap partner?{" "}
            <a href="/contactUs">Get in touch &rarr;</a>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

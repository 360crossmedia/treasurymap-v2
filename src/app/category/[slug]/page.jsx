import { notFound } from "next/navigation";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { CATEGORIES, CATEGORY_BY_SLUG } from "../../components/proceduralMap/categoryInfo";
import { getCategoryProviders } from "../../components/proceduralMap/categoryData";
import styles from "../category.module.css";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://treasurymap-v2-production.up.railway.app";

// Statically generate all 15 category pages at build time (fast + crawlable).
export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const cat = CATEGORY_BY_SLUG[slug];
  if (!cat) return {};
  const title = `${cat.full} (${cat.code}) providers in Europe`;
  return {
    title,
    description: cat.summary,
    alternates: { canonical: `/category/${cat.slug}` },
    openGraph: {
      title: `${title} | TreasuryMap`,
      description: cat.summary,
      url: `${SITE_URL}/category/${cat.slug}`,
      type: "website",
    },
  };
}

export default async function CategoryPage({ params }) {
  const { slug } = await params;
  const cat = CATEGORY_BY_SLUG[slug];
  if (!cat) notFound();

  const providers = await getCategoryProviders(cat.id);

  // Structured data: breadcrumb + the category as a collection of providers.
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          {
            "@type": "ListItem",
            position: 2,
            name: cat.full,
            item: `${SITE_URL}/category/${cat.slug}`,
          },
        ],
      },
      {
        "@type": "CollectionPage",
        "@id": `${SITE_URL}/category/${cat.slug}`,
        name: `${cat.full} (${cat.code}) providers in Europe`,
        description: cat.summary,
        isPartOf: { "@id": `${SITE_URL}/#website` },
        mainEntity: {
          "@type": "ItemList",
          numberOfItems: providers.length,
          itemListElement: providers.map((p, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: p.name,
            url: `${SITE_URL}${p.href}`,
          })),
        },
      },
    ],
  };

  const others = CATEGORIES.filter((c) => c.slug !== cat.slug);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar buttonLabel="Log In" />

      <main className={styles.page}>
        <section className={styles.hero}>
          <div className={styles.inner}>
            <nav className={styles.crumbs} aria-label="Breadcrumb">
              <a href="/">Home</a>
              <span>/</span>
              <a href="/providers">Providers</a>
              <span>/</span>
              {cat.full}
            </nav>
            <span className={styles.tag}>{cat.code}</span>
            <h1 className={styles.h1}>{cat.full} in Europe</h1>
            <p className={styles.count}>
              <strong>{providers.length}</strong>{" "}
              {providers.length === 1 ? "provider" : "providers"} listed on TreasuryMap
            </p>
            <p className={styles.desc}>{cat.desc}</p>
            <div className={styles.actions}>
              <a className={styles.btnPrimary} href={`/?category=${cat.code}`}>
                See {cat.code} on the interactive map &rarr;
              </a>
              <a className={styles.btnGhost} href="/get-my-list">
                Build my shortlist
              </a>
            </div>
          </div>
        </section>

        <section className={styles.body}>
          <div className={styles.inner}>
            <h2 className={styles.sectionTitle}>
              {cat.full} providers
            </h2>

            {providers.length ? (
              <div className={styles.grid}>
                {providers.map((p) => (
                  <a key={p._k} className={styles.card} href={p.href}>
                    <span className={styles.logoBox}>
                      {p.logo ? (
                        <img src={p.logo} alt={`${p.name} logo`} loading="lazy" />
                      ) : null}
                    </span>
                    <span className={styles.cardName}>{p.name}</span>
                    {p.location ? <span className={styles.cardLoc}>{p.location}</span> : null}
                  </a>
                ))}
              </div>
            ) : (
              <p className={styles.empty}>No providers are listed in this category yet.</p>
            )}

            <div className={styles.other}>
              <h2 className={styles.otherTitle}>Explore other categories</h2>
              <div className={styles.otherGrid}>
                {others.map((c) => (
                  <a key={c.slug} className={styles.otherLink} href={`/category/${c.slug}`}>
                    {c.full} ({c.code})
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

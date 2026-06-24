// Server-rendered "Treasury technology in Europe, by category" section.
// Renders just under the map on the homepage. Its purpose is SEO/GEO: the full
// list of categories and providers lands in the initial HTML (crawlable), where
// the interactive map is client-only canvas. Collapsed by default, compact.
//
// Grouping mirrors the homepage map exactly (see categoryData.groupByMainCategory):
//   live + has logo + maincategory[0] · one logo per vendor · dedupe by name.
import { CATEGORIES } from "./categoryInfo";
import { fetchCompanies, groupByMainCategory } from "./categoryData";
import styles from "./LandscapeSEO.module.css";

const PREVIEW_COUNT = 6; // provider names shown per card before "View all"

export default async function LandscapeSEO() {
  const companies = await fetchCompanies();
  const byCat = groupByMainCategory(companies);

  // Keep CAT_META order (category-1 .. 15); only categories that have providers.
  const categories = CATEGORIES.map((c) => ({ ...c, items: byCat[c.id] || [] })).filter(
    (c) => c.items.length
  );
  if (!categories.length) return null; // never break the page if the API is down

  return (
    <section className={styles.wrap} aria-labelledby="tm-landscape-title">
      <div className={styles.inner}>
        <span className={styles.eyebrow}>// Explore the landscape</span>
        <h2 id="tm-landscape-title" className={styles.title}>
          Treasury technology in Europe, by category
        </h2>
        <p className={styles.lead}>
          <strong>TreasuryMap</strong> is the practitioner-curated map of treasury
          technology in Europe. It spans the full treasury stack across {categories.length} categories,
          from treasury and risk management systems to bank connectivity, FX, dealing platforms, cash
          forecasting and payments. Browse every category and the providers listed on the map below.
        </p>

        <details className={styles.collapse}>
          <summary>
            <span className={styles.sumLeft}>
              <span className={styles.sumCount}>{categories.length} categories</span>
              <span>Browse the categories and the providers on the map</span>
            </span>
            <span className={styles.chev} aria-hidden="true">&#9662;</span>
          </summary>

          <div className={styles.grid}>
            {categories.map((cat) => (
              <article key={cat.code} className={styles.cat}>
                <span className={styles.tag}>{cat.code}</span>
                <h3>
                  <a className={styles.catLink} href={`/category/${cat.slug}`}>{cat.full}</a>
                </h3>
                {cat.desc && <p>{cat.desc}</p>}
                <div className={styles.providers}>
                  {cat.items.slice(0, PREVIEW_COUNT).map((p) => (
                    <a key={p._k} href={p.href}>{p.name}</a>
                  ))}
                </div>
                <a className={styles.all} href={`/category/${cat.slug}`}>
                  View all {cat.items.length} providers &rarr;
                </a>
              </article>
            ))}
          </div>
        </details>

        <p className={styles.foot}>
          TreasuryMap is published by{" "}
          <a href="https://www.simplytreasury.com" rel="noopener">Simply Treasury</a>, founded by
          François Masquelier, Chairman of ATEL and EACT.
        </p>
      </div>
    </section>
  );
}

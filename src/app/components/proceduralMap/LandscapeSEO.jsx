// Server-rendered "Treasury technology in Europe, by category" section.
// Renders just under the map on the homepage. Its purpose is SEO/GEO: the full
// list of categories and providers lands in the initial HTML (crawlable), where
// the interactive map is client-only canvas. Collapsed by default, compact.
//
// Grouping mirrors the homepage map exactly (see ProceduralMap.toCats):
//   live + has logo + maincategory[0] · one logo per vendor · dedupe by name.
import { url } from "../../service/url";
import { providerHref } from "../../utils/slugify";
import { CAT_META } from "./catMeta";
import styles from "./LandscapeSEO.module.css";

// One-line, practitioner-style definition per category code. Editorial copy ·
// safe to tweak without touching the data wiring.
const DESC = {
  FIDP: "Electronic platforms to deal FX, money-market and other instruments with banks.",
  FDF: "Market data and pricing feeds for treasury: rates, FX, securities and ratings.",
  CMA: "Automate FX exposure capture, hedging workflows and execution.",
  INT: "Consultancies and integrators that implement and connect treasury technology.",
  OTS: "Specialised tools across the wider treasury stack.",
  TRMS: "Core systems that centralise cash, payments, risk and reporting across the group.",
  ERP: "Enterprise resource planning systems that treasury connects to for finance data.",
  OUT: "Outsourced treasury operations and managed services.",
  ETL: "Data integration tools that extract, transform and load treasury data.",
  FSC: "Supply-chain finance: receivables, payables and working-capital programmes.",
  CFF: "Turn ERP and bank data into reliable, decision-ready cash forecasts.",
  eBAM: "Manage bank accounts, signatories and mandates electronically.",
  BSG: "Single gateways to every bank: SWIFT, EBICS, host-to-host and API connectivity.",
  TR: "Dashboards, analytics and reporting for treasury.",
  PSP: "Payment service providers and rails for corporate payments.",
};

const PREVIEW_COUNT = 6; // provider names shown per card before "View all"

// Same source + filtering as the homepage map, server-side.
async function getCategories() {
  let companies = [];
  try {
    const res = await fetch(`${url}/api/v1/companies/`, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const data = await res.json();
    companies = Array.isArray(data) ? data : [];
  } catch {
    return [];
  }

  // catId -> [{ name, href }], deduped by name (golden rule), in CAT_META order.
  const byCat = {};
  for (const c of companies) {
    if (!c.live || !c.logo) continue;
    if (!c.maincategory || !c.maincategory.length) continue;
    const catId = c.maincategory[0];
    if (!CAT_META[`category-${catId}`]) continue;
    (byCat[catId] ||= []);
    const nameKey = (c.name || "").trim().toLowerCase() || `id-${c.id}`;
    if (byCat[catId].some((x) => x._k === nameKey)) continue;
    byCat[catId].push({ _k: nameKey, name: c.name || "—", href: providerHref({ name: c.name, id: c.id }) });
  }

  return Object.entries(byCat)
    .sort((a, b) => Number(a[0]) - Number(b[0]))
    .map(([catId, items]) => {
      const meta = CAT_META[`category-${catId}`];
      const sorted = items.sort((a, b) => a.name.localeCompare(b.name));
      return { code: meta.code, full: meta.full, total: sorted.length, items: sorted };
    });
}

export default async function LandscapeSEO() {
  const categories = await getCategories();
  if (!categories.length) return null; // never break the page if the API is down

  return (
    <section className={styles.wrap} aria-labelledby="tm-landscape-title">
      <div className={styles.inner}>
        <span className={styles.eyebrow}>// Explore the landscape</span>
        <h2 id="tm-landscape-title" className={styles.title}>
          Treasury technology in Europe, by category
        </h2>
        <p className={styles.lead}>
          <strong>TreasuryMap</strong> is the independent, practitioner-curated map of treasury
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
                <h3>{cat.full}</h3>
                {DESC[cat.code] && <p>{DESC[cat.code]}</p>}
                <div className={styles.providers}>
                  {cat.items.slice(0, PREVIEW_COUNT).map((p) => (
                    <a key={p._k} href={p.href}>{p.name}</a>
                  ))}
                </div>
                <a className={styles.all} href={`/?category=${cat.code}`}>
                  View all {cat.total} providers &rarr;
                </a>
              </article>
            ))}
          </div>
        </details>

        <p className={styles.foot}>
          TreasuryMap is published by{" "}
          <a href="https://www.simplytreasury.com" rel="noopener">Simply Treasury</a>, founded by
          François Masquelier, Chairman of ATEL and EACT. Independent and not vendor-funded editorial.
        </p>
      </div>
    </section>
  );
}

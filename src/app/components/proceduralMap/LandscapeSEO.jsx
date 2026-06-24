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

// One-line definition per category code, condensed from the TreasuryMap report
// (François Masquelier). Editorial copy · safe to tweak without touching the
// data wiring.
const DESC = {
  FIDP: "Web-based platforms that put banks in live competition to trade FX, rates and OTC derivatives at best execution.",
  FDF: "Feed TRMS, ERP and other systems with FX rates, yield curves and market data for pricing, accounting and revaluation.",
  CMA: "Automate the full FX workflow: policy, hedge-ratio calculation, execution with banks and IFRS 9 hedge accounting.",
  INT: "Consulting and implementation partners that select, integrate and optimise treasury technology, often platform-specialised.",
  OTS: "Point solutions for specific needs: KYC, signature power, bank fee analysis, fraud and sanction screening, netting and more.",
  TRMS: "The central system of record for treasury: cash, payments, risk and investments, integrated with ERP, banks and market data.",
  ERP: "Enterprise systems with built-in treasury modules for cash, payments and bank connectivity, tightly tied to finance data.",
  OUT: "Outsource part or all of treasury operations to third-party experts who execute FX, cash, payments and reporting under SLAs.",
  ETL: "Data integration that extracts, transforms and loads financial data from banks, ERP and markets into treasury systems.",
  FSC: "Optimise buyer-supplier flows: supply chain finance, dynamic discounting, receivables and payables for working capital.",
  CFF: "Consolidate ERP and bank data into short-to-long-term cash forecasts, with scenario analysis and AI-assisted accuracy.",
  eBAM: "Automate opening, maintaining and closing bank accounts and signatories with banks, on the SWIFT / ISO 20022 standard.",
  BSG: "A single connectivity hub to exchange messages with every bank: SWIFT, ISO 20022, EBICS, APIs and legacy file formats.",
  TR: "Real-time and periodic dashboards and analytics on cash, risk, hedging and liquidity, consolidated from TMS, ERP and banks.",
  PSP: "Accept and process electronic payments, acting as gateway between merchants and banks, with FX, wallets and fraud protection.",
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

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

// Category definitions taken verbatim from the TreasuryMap report (François
// Masquelier). Long dashes removed per house style. Edit here to refine copy ·
// the data wiring is untouched.
const DESC = {
  FIDP: "Dealing Platforms are global providers of web-based trading technology, enabling clients to trade OTC financial instruments, as well as FX and interest rate derivatives. They give treasurers a way to place all their banks in live competition to get the best execution. They may also offer risk management services on financial markets, as well as sometimes dealing some OTC derivatives and financial instruments.",
  FDF: "Financial Data Feeding (FDF) platforms are fit for feeding TRMS or ERP or any other systems in FX rates and yield curves, or with anything requested for accounting and revaluation purposes. These tools can also offer a visitor to view all financial data on financial markets, as well as sometimes dealing some OTC derivatives and financial instruments.",
  CMA: "Currency Management Automation (CMA) is a technology that streamlines the entire foreign currency workflow. By automating the different phases of the FX management process, businesses can remove costs and risks (including currency risk) and unlock opportunities for growth. CMA platforms embed the full FX policy, automate hedge ratio calculations, execute hedges automatically with bank counterparties, and produce IFRS 9 hedge accounting documentation, all without manual treasury intervention.",
  INT: "Treasury Technology Integrators are consulting firms and implementation partners that help corporate treasury functions design, select, implement, and optimise treasury technology. They bridge the gap between treasury functional requirements and technology solutions, providing project management, system integration, data migration, change management, and ongoing support. Many integrators specialise in specific TMS platforms (kyriba, ION, SAP) or ERP treasury modules. The quality of the integrator is often as important as the technology itself in determining implementation success.",
  OTS: "In this category 'Other Solutions' there are solutions on specific issues: e.g. KYC automation, Signature Power digitisation, RFP digitisation, bank fee analysis, etc. It means any other solution dedicated to automate treasury processes not included in the other named categories. This includes bank fees analysis, guarantees management, fraud prevention, sanction screening, multilateral netting, and other treasury-specific workflow tools that complement the core treasury technology stack.",
  TRMS: "A Treasury Risk Management System (TRMS) is a software application that automates the process of managing a company's financial operations. It helps companies to manage their financial activities, such as cash flow, assets and investments, risk management, automatically. A TMS is commonly used to maintain financial security and minimize reputational risk. The TRMS serves as the central system of record for treasury, integrating with ERP, banks, dealing platforms, market data providers, and reporting tools.",
  ERP: "Enterprise Resource Planning (ERP) platforms include integrated treasury modules that manage core treasury processes (cash management, payments, bank connectivity, and basic risk management) within the broader enterprise system. ERP treasury modules are deeply integrated with the company's financial data, eliminating reconciliation overhead, but typically offer less functional depth than dedicated TRMS platforms. For many mid-market companies, the ERP treasury module is the primary (or sole) treasury technology.",
  OUT: "Outsourcing treasury operations means that part or all the front-office transactions and processes are sub-contracted to a third party, using treasury experts and dedicated IT treasury solutions. They act on behalf of their customers according to predefined SLAs. Treasury outsourcing covers FX dealing, cash management, payments, reporting, and potentially full treasury function management. It is distinct from treasury consulting (advisory only): outsourcing providers execute treasury operations on behalf of their clients.",
  ETL: "Extract Transform Load (ETL) solutions in the treasury context are data integration platforms that automate the extraction of financial data from source systems (ERP, banks, trading platforms, market data providers), transform it into standardised formats, and load it into treasury or reporting systems. In a treasury context, ETL is critical for aggregating cash positions from multiple banks and systems, consolidating FX exposures, feeding forecasting models, and populating risk management platforms. Modern ETL solutions increasingly include real-time API pipelines and treasury-specific data models.",
  FSC: "Financial Supply Chain (FSC) solutions optimise the financial flows between buyers and suppliers in a supply chain. They include supply chain finance (reverse factoring), dynamic discounting, receivables finance, and payables optimisation tools. For corporate treasury, FSC platforms enable working capital optimisation, supplier financing programmes, and early payment solutions that improve cash conversion cycles. They sit at the intersection of treasury, procurement, and accounts payable.",
  CFF: "The Cash Flow Forecasting solutions are dedicated to short-to-long-term consolidated forecasts, including sensitivity analysis and stress testing. It consists of extracting data from ERPs and potentially other tools to consolidate all data into one solution to assess the flows of cash (in and out) and to automatically update the forecasts. AI and machine learning are increasingly used to improve forecast accuracy, reduce manual effort, and provide scenario-based liquidity management.",
  eBAM: "Electronic Bank Account Management (eBAM) represents the automation, through software, of the following activities between banks and their corporate customers: opening bank accounts, maintaining bank accounts such as changing account signatories or spending limit, closing bank accounts, generating reports as required by law or regulation. The technology that is commonly used to implement eBAM automation is defined by SWIFT and the ISO 20022 Standard for Update Financial Services Messaging.",
  BSG: "Bank Single Gateway (BSG) solutions streamline multi-bank connectivity by providing a single access point through which companies can send and receive financial messages to and from all their banking partners. They replace direct, bilateral connections with a standardised communication hub, reducing complexity, cost, and operational risk. BSG platforms support SWIFT, ISO 20022, EBICS, APIs, and legacy bank file formats (MT940, camt.053, XML, CSV), and are the backbone of modern treasury bank connectivity architectures.",
  TR: "Treasury Reporting solutions provide CFOs, Boards, and treasury teams with real-time and periodic dashboards, reports and analytics covering cash positions, risk exposures, hedging portfolios, investment performance, and liquidity metrics. They consolidate data from TMS, ERP, banks, and market data sources into management information, enabling informed treasury decisions and regulatory compliance reporting. Treasury Reporting tools may be standalone BI/analytics platforms, modules within a TMS, or specialised treasury dashboard solutions.",
  PSP: "A Payment Service Provider (PSP) is a third-party company that allows businesses to accept electronic payments such as credit and debit card payments. PSPs act as intermediaries between those who make payments (consumers) and those who accept them (retailers/merchants). They will typically offer merchant services and act as a payment gateway or payment processor for e-commerce and brick-and-mortar businesses. They may also offer risk management services for card and bank-based payments, transaction payment matching, digital wallets, reporting, fund remittance, currency exchange (hedging), exotic cross-border transfers and fraud protection.",
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
    byCat[catId].push({ _k: nameKey, name: c.name || "Provider", href: providerHref({ name: c.name, id: c.id }) });
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

// Single source of truth for the 15 treasury-technology categories used by the
// SEO surfaces: the homepage "by category" section, the /category/[slug] landing
// pages, and the sitemap. Built on top of CAT_META (code / full name / hue) and
// adds an SEO slug plus the full definition (verbatim from the TreasuryMap
// report by François Masquelier · long dashes removed per house style).
import { CAT_META } from "./catMeta";
import { slugify } from "../../utils/slugify";

export const CATEGORY_DESC = {
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

// Short, meta-description-friendly summary per category (<160 chars, no dashes).
export const CATEGORY_SUMMARY = {
  FIDP: "Web-based dealing platforms that put banks in live competition to trade FX, rates and OTC derivatives at best execution.",
  FDF: "Financial data feeds that supply TRMS, ERP and other systems with FX rates, yield curves and market data for pricing and revaluation.",
  CMA: "Currency Management Automation streamlines the FX workflow: policy, hedge ratios, execution with banks and IFRS 9 hedge accounting.",
  INT: "Consulting and implementation partners that help corporates design, select, implement and optimise treasury technology.",
  OTS: "Specialised treasury tools: KYC automation, signature power, bank fee analysis, fraud and sanction screening, netting and more.",
  TRMS: "Treasury Risk Management Systems: the central system of record for cash, payments, risk and investments across the group.",
  ERP: "ERP platforms with integrated treasury modules for cash, payments and bank connectivity, tied to enterprise financial data.",
  OUT: "Treasury outsourcing providers that execute FX, cash, payments and reporting on behalf of corporates under defined SLAs.",
  ETL: "ETL platforms that extract, transform and load financial data from banks, ERP and markets into treasury and reporting systems.",
  FSC: "Financial Supply Chain tools: supply chain finance, dynamic discounting, receivables and payables for working capital.",
  CFF: "Cash Flow Forecasting solutions that consolidate ERP and bank data into short to long term forecasts with scenario analysis.",
  eBAM: "Electronic Bank Account Management automates opening, maintaining and closing bank accounts on the SWIFT and ISO 20022 standard.",
  BSG: "Bank Single Gateway solutions: one connectivity hub for every bank via SWIFT, ISO 20022, EBICS, APIs and legacy file formats.",
  TR: "Treasury Reporting dashboards and analytics on cash, risk, hedging and liquidity, consolidated from TMS, ERP and banks.",
  PSP: "Payment Service Providers that accept and process electronic payments, with FX, wallets, reporting and fraud protection.",
};

// "Why it matters for corporate treasurers" · one short paragraph per category.
export const CATEGORY_WHY = {
  TR: "Treasurers live or die by the quality of their reporting. Boards expect a clear, current view of cash, debt, liquidity and risk, and regulators expect it documented. Good reporting turns scattered data from banks, the TMS and ERP into decisions, and it is often the first capability a growing treasury professionalises.",
  eBAM: "Managing bank accounts by paper and email is slow, error-prone and a real fraud and audit risk, especially across many banks and jurisdictions. eBAM gives treasury a controlled, auditable, standardised process for the entire account lifecycle, and is increasingly expected by auditors and KYC teams.",
  BSG: "As soon as a company works with more than a handful of banks, bilateral connections become costly and fragile. A single gateway centralises connectivity, normalises formats and removes a major source of operational risk and reconciliation lag. It is the plumbing on which payments, reporting and forecasting all depend.",
  PSP: "For treasuries supporting e-commerce, marketplaces or international sales, the PSP is where money actually enters the business. The choice affects acceptance rates, FX cost, settlement speed, cross-border reach and fraud exposure, so it belongs on the treasury risk register.",
  FIDP: "Executing FX and rates deals by phone or email leaves money on the table and creates audit gaps. A dealing platform puts banks in live competition for best execution, time-stamps every trade and feeds the TMS automatically, improving both pricing and control.",
  FDF: "Every downstream treasury process, revaluation, hedge accounting, forecasting and reporting, is only as good as the market data behind it. A reliable, automated data feed removes manual rate entry, a classic source of error, and keeps valuations defensible.",
  ETL: "Treasury data lives in many systems that do not naturally talk to each other. ETL is the connective tissue that aggregates positions, exposures and flows into a single, clean dataset. Without it, treasurers spend their time on spreadsheets instead of decisions.",
  CMA: "FX management is repetitive, rules-based and high-stakes, an ideal candidate for automation. CMA enforces the hedging policy consistently, removes manual errors across the exposure-to-hedge-accounting cycle, and frees the team from spreadsheet-driven hedging.",
  CFF: "Cash visibility is the number one treasury priority, yet forecasting stays largely manual and Excel-bound in many companies. Dedicated tools consolidate data automatically, add scenario and sensitivity analysis, and increasingly use AI to sharpen accuracy, turning forecasting from a chore into a planning asset.",
  TRMS: "The TRMS is the backbone of a mature treasury, the single system of record connecting cash, debt, investments, risk and accounting. Choosing one is a multi-year commitment that shapes how the whole function operates, which is why selection deserves real rigour.",
  ERP: "For many mid-market companies, the ERP treasury module is the treasury system, with no separate TMS. Deep integration with financial data removes reconciliation overhead, but functional depth varies, so it is essential to know where the ERP module ends and a specialist tool is needed.",
  FSC: "Working capital is often the cheapest source of liquidity a company has. Financial supply chain tools unlock it through supplier financing, dynamic discounting and receivables programmes, making them a direct lever on cash and a natural bridge between treasury, procurement and AP.",
  OTS: "Not every treasury need fits a neat category. Bank fee analysis, KYC, guarantees, sanctions screening, netting and signature management each solve a specific, often painful problem. These specialist tools quietly remove risk and cost from the treasury stack.",
  INT: "The best technology fails with a poor implementation. Integrators bring the methodology, platform expertise and change management that decide whether a project lands on time and delivers value. For most treasuries, the integrator choice is as consequential as the software choice.",
  OUT: "Not every company has the scale or appetite to run treasury in-house. Outsourcing gives access to expert teams and dedicated technology under clear SLAs, covering anything from FX dealing to the full function, while leaving governance with the company.",
};

// "Key selection criteria" · 5 to 6 practitioner bullets per category.
export const CATEGORY_CRITERIA = {
  TR: ["Data coverage: can it pull from your TMS, ERP, all banks and market data sources?", "Real-time versus periodic: how fresh are positions and exposures?", "Self-service dashboards versus fixed reports, and board-ready outputs", "Regulatory and compliance reporting templates", "Drill-down from summary to transaction level", "Standalone tool or TMS module: does it fit your existing stack?"],
  eBAM: ["SWIFT and ISO 20022 (acmt) message support", "Coverage of your banking partners", "Full lifecycle: open, maintain, close, mandates and signatories", "Audit trail, segregation of duties and approval workflows", "Integration with KYC and your TMS or ERP", "Reporting for legal and regulatory requirements"],
  BSG: ["Protocol coverage: SWIFT, EBICS, host-to-host, APIs", "Format support and transformation (MT, ISO 20022 camt and pain, MT940, CSV, XML)", "Bank coverage and onboarding effort per bank", "Resilience, security and fraud controls", "Straight-through processing into TMS or ERP", "Pricing model: per bank, per message or flat"],
  PSP: ["Acceptance methods and geographic reach", "FX handling and cross-border cost", "Settlement speed and reconciliation", "Fraud prevention and chargeback management", "Fees: transaction, FX margin and hidden costs", "Integration with your ERP or TMS and reporting"],
  FIDP: ["Instrument coverage: FX spot, forward and swap, IRS, money market", "Multi-bank competitive execution and price discovery", "Pre- and post-trade analytics and audit trail", "Straight-through integration to your TMS", "Counterparty and bank coverage", "Compliance, best-execution and reporting support"],
  FDF: ["Data types: FX rates, yield curves, credit, reference data", "Source quality, reliability and update frequency", "Delivery: file, API or direct system feed", "Integration with your TMS or ERP for revaluation", "Coverage of the instruments you actually hold", "Cost relative to in-house data sourcing"],
  ETL: ["Connectors to your source systems (ERP, banks, trading, market data)", "Real-time API pipelines versus batch", "Treasury-specific data model and transformations", "Data quality, error handling and reconciliation", "Scalability as banks and entities are added", "Maintenance effort and dependency on IT"],
  CMA: ["End-to-end coverage: exposure capture to hedge accounting", "Policy enforcement and automated hedge ratios", "Automated execution with bank counterparties", "IFRS 9 hedge accounting documentation", "ERP or TMS integration and exposure data quality", "Transparency of pricing and FX margins"],
  CFF: ["Data sources: ERP, banks, AR and AP, other systems", "Forecast horizons: short, medium and long term", "Scenario, sensitivity and stress testing", "AI and ML forecasting and variance analysis", "Ease of updating and actuals versus forecast tracking", "Integration with the TMS and reporting"],
  TRMS: ["Functional fit: cash, payments, debt, investments, risk, accounting", "Bank connectivity and market data integration", "Deployment: SaaS versus on-premise, and total cost of ownership", "Scalability across entities, currencies and geographies", "Implementation effort and integrator ecosystem", "Reporting, audit and regulatory support"],
  ERP: ["Depth of the native treasury module versus a dedicated TMS", "Integration with the rest of the ERP financial data", "Bank connectivity and payment capabilities", "Where the module ends and a specialist tool is needed", "Implementation and upgrade complexity", "Total cost versus running a separate TMS"],
  FSC: ["Programme types: reverse factoring, dynamic discounting, receivables finance", "Funder model: bank-funded, multi-funder or self-funded", "Supplier onboarding effort and reach", "Accounting treatment (on or off balance sheet) and audit comfort", "Integration with ERP or AP and treasury", "Pricing and impact on the cash conversion cycle"],
  OTS: ["The specific problem solved (fees, KYC, guarantees, netting, screening)", "Fit with your existing TMS or ERP rather than overlap", "Integration and data requirements", "Regulatory relevance (sanctions, KYC, audit)", "Implementation effort versus the pain removed", "Vendor specialisation and references"],
  INT: ["Platform expertise for your chosen TMS or ERP", "Track record on comparable treasury projects", "Methodology: project management, migration, change management", "Team seniority and continuity through the project", "Independence versus vendor affiliation", "Post go-live support model"],
  OUT: ["Scope: FX dealing, cash, payments, reporting or full function", "SLAs, governance and control retained by you", "Technology used and reporting transparency", "Security, segregation of duties and audit", "Pricing model and scalability", "Exit and reversibility terms"],
};

// Ordered list (category-1 .. category-15) with id, code, full name, hue, SEO
// slug, full definition and short summary.
export const CATEGORIES = Object.entries(CAT_META).map(([key, m]) => {
  const id = parseInt(key.split("-")[1], 10);
  return {
    key,
    id,
    code: m.code,
    full: m.full,
    hue: m.hue,
    slug: slugify(m.full),
    desc: CATEGORY_DESC[m.code] || "",
    summary: CATEGORY_SUMMARY[m.code] || "",
    why: CATEGORY_WHY[m.code] || "",
    criteria: CATEGORY_CRITERIA[m.code] || [],
  };
});

export const CATEGORY_BY_SLUG = Object.fromEntries(CATEGORIES.map((c) => [c.slug, c]));
export const CATEGORY_BY_CODE = Object.fromEntries(CATEGORIES.map((c) => [c.code, c]));
export const CATEGORY_BY_ID = Object.fromEntries(CATEGORIES.map((c) => [c.id, c]));

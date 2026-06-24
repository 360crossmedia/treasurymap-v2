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
  };
});

export const CATEGORY_BY_SLUG = Object.fromEntries(CATEGORIES.map((c) => [c.slug, c]));
export const CATEGORY_BY_CODE = Object.fromEntries(CATEGORIES.map((c) => [c.code, c]));
export const CATEGORY_BY_ID = Object.fromEntries(CATEGORIES.map((c) => [c.id, c]));

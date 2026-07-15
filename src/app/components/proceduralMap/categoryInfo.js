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

// Frequently asked questions · 4 to 5 practitioner Q&A per category. This is the
// single strongest "GEO" surface: the question/answer format is exactly what
// LLMs (ChatGPT, Perplexity, Google AI) quote, and it powers the FAQPage rich
// result on Google. Answers are editorial and vendor-neutral (no self-declared
// product data), kept short and factual so they read as a direct answer.
export const CATEGORY_FAQ = {
  TRMS: [
    {
      q: "What is a Treasury Management System (TMS)?",
      a: "A Treasury Management System is software that acts as the central system of record for corporate treasury. It automates and connects cash management, payments, debt and investments, financial risk, bank connectivity and treasury accounting, giving treasurers one reliable view instead of scattered spreadsheets and bank portals.",
    },
    {
      q: "What is the difference between a TMS and an ERP treasury module?",
      a: "A dedicated TMS usually offers more functional depth for risk, hedging, debt and forecasting, while an ERP treasury module is more tightly integrated with the company's financial data and removes reconciliation overhead. Many mid-market companies run the ERP module alone; larger or risk-intensive treasuries add a specialist TMS on top.",
    },
    {
      q: "How long does a TMS implementation take?",
      a: "It varies with scope and the number of banks and entities, but a typical corporate implementation runs from a few months to over a year. The quality of the implementation partner (the integrator) is often as decisive as the software itself in landing on time and on budget.",
    },
    {
      q: "Do I really need a TMS, or is a spreadsheet enough?",
      a: "Spreadsheets can work for a very small, single-bank treasury, but they become a control, error and fraud risk as banks, currencies and entities multiply. A TMS is justified once cash visibility, payment security and audit trails matter more than the licence cost.",
    },
    {
      q: "How do I choose the right TMS?",
      a: "Start from your functional priorities (cash, payments, risk, debt, forecasting), then weigh bank connectivity, market-data integration, deployment model and total cost of ownership, scalability across entities and currencies, the integrator ecosystem, and reporting and audit support. TreasuryMap lists the TRMS providers active in Europe so you can build a shortlist.",
    },
  ],
  CFF: [
    {
      q: "What is cash flow forecasting software?",
      a: "It is a tool that consolidates data from ERP, banks and other systems to project cash inflows and outflows over short to long horizons. It automates the collection and updating of forecasts and typically adds scenario, sensitivity and stress-testing so treasurers can plan liquidity instead of rebuilding spreadsheets.",
    },
    {
      q: "How does AI improve cash flow forecasting?",
      a: "Machine learning analyses historical flows and payment behaviour to predict timing and amounts more accurately than manual models, flag variances automatically, and reduce the effort of updating forecasts. The result is a more reliable short-term liquidity picture and faster scenario analysis.",
    },
    {
      q: "Why is cash flow forecasting still done in Excel?",
      a: "Excel is flexible and familiar, so many treasuries default to it, but manual forecasting is slow, error-prone and hard to audit as the business grows. Dedicated tools remove the manual data pulls, keep actuals-versus-forecast tracking current, and free the team for analysis.",
    },
    {
      q: "What data sources feed a cash flow forecast?",
      a: "Typically the ERP, bank statements and balances, accounts receivable and payable, and sometimes the TMS, payroll and tax systems. The breadth and cleanliness of these sources largely determine how accurate and timely the forecast can be.",
    },
    {
      q: "How accurate can automated cash flow forecasting be?",
      a: "Accuracy depends on data quality, horizon and business volatility rather than the tool alone. Automation and AI improve short-term accuracy the most, while longer horizons remain driven by assumptions. The practical goal is a forecast reliable enough to act on, with variance analysis to keep improving it.",
    },
  ],
  BSG: [
    {
      q: "What is a Bank Single Gateway (bank connectivity hub)?",
      a: "A Bank Single Gateway is a single connection point through which a company exchanges payment and statement messages with all of its banks. It replaces fragile bilateral connections with one standardised hub, normalising formats and removing a major source of operational risk and reconciliation lag.",
    },
    {
      q: "What is the difference between SWIFT, EBICS, host-to-host and APIs?",
      a: "They are different channels to reach banks. SWIFT is the global interbank network, EBICS is a European bank-transmission standard, host-to-host is a direct file link with a specific bank, and APIs offer real-time, request-based connectivity. A good gateway supports several so you are not locked to one bank's method.",
    },
    {
      q: "When does a company need a bank connectivity solution?",
      a: "As soon as it works with more than a handful of banks, or needs secure, automated, auditable payment and statement flows across countries. Below that, bank portals may suffice, but they do not scale and leave payments exposed to manual error and fraud.",
    },
    {
      q: "What file formats do bank gateways support?",
      a: "Modern gateways handle ISO 20022 messages (pain for payments, camt for statements) alongside legacy formats such as MT940, MT101 and country-specific or CSV files, transforming between them so every bank receives what it expects.",
    },
    {
      q: "Is SWIFT the only way to connect to banks?",
      a: "No. SWIFT is one option, well suited to large multi-bank corporates, but EBICS, host-to-host links and bank APIs are widely used and often cheaper for a given footprint. The right mix depends on your banks, countries and volumes, which is why a gateway that speaks several protocols is valuable.",
    },
  ],
  FIDP: [
    {
      q: "What is a multi-bank FX dealing platform?",
      a: "It is web-based trading technology that lets a treasury request quotes from several banks at once and execute FX, money-market and OTC derivative deals in competition. Every trade is time-stamped and fed to the TMS, replacing bilateral phone or email dealing.",
    },
    {
      q: "Why use a dealing platform instead of calling banks?",
      a: "Putting banks in live competition improves pricing, and electronic execution removes the audit gaps and manual errors of phone or email dealing. It also creates a defensible best-execution record and straight-through processing into your treasury systems.",
    },
    {
      q: "What can I trade on a dealing platform?",
      a: "Typically FX spot, forwards and swaps, money-market instruments, and interest-rate derivatives, though coverage varies by platform. Some also provide pre- and post-trade analytics and support for structured or less-liquid OTC products.",
    },
    {
      q: "How does a dealing platform support best execution?",
      a: "By collecting competing quotes, time-stamping each request and trade, and storing the full audit trail, it lets treasurers demonstrate that a deal was executed at a competitive price, which supports internal policy and regulatory expectations.",
    },
  ],
  FDF: [
    {
      q: "What is a financial data feed in treasury?",
      a: "It is an automated supply of market data (FX rates, yield curves, reference and credit data) into treasury systems such as a TRMS or ERP. It powers revaluation, hedge accounting, forecasting and reporting without manual rate entry.",
    },
    {
      q: "Why not just enter FX rates manually?",
      a: "Manual entry is slow and a classic source of error, and it makes valuations hard to defend to auditors. An automated feed keeps rates current and consistent across every downstream process, so revaluations and reports stay reliable.",
    },
    {
      q: "What market data does a treasury need?",
      a: "Usually FX spot and forward rates, interest-rate and yield curves, and sometimes credit spreads and reference data, matched to the instruments the company actually holds. The right scope depends on the hedging and investment activity in place.",
    },
    {
      q: "How does a data feed connect to my systems?",
      a: "Feeds are delivered by file, API or a direct system integration into the TMS or ERP. The best fit depends on how frequently you need updates and how your treasury platform ingests external data.",
    },
  ],
  CMA: [
    {
      q: "What is Currency Management Automation (CMA)?",
      a: "CMA is technology that automates the whole FX workflow: it embeds the hedging policy, captures exposures, calculates hedge ratios, executes hedges with bank counterparties and produces IFRS 9 hedge-accounting documentation, all with minimal manual intervention.",
    },
    {
      q: "How is CMA different from a dealing platform or a TMS?",
      a: "A dealing platform executes trades and a TMS records them, while CMA automates the decisions around them: which exposures to hedge, at what ratio, and with the accounting that follows. It focuses specifically on the exposure-to-hedge-accounting cycle.",
    },
    {
      q: "Does CMA handle hedge accounting?",
      a: "Yes. A core benefit is generating IFRS 9 hedge-accounting documentation automatically as hedges are placed, which removes a manual, error-prone task and keeps the treatment consistent and auditable.",
    },
    {
      q: "Who needs Currency Management Automation?",
      a: "Companies with frequent, rules-based FX exposures across many currencies or entities benefit most, especially where hedging is still run on spreadsheets. CMA enforces the policy consistently and frees the team from repetitive manual hedging.",
    },
  ],
  INT: [
    {
      q: "What does a treasury technology integrator do?",
      a: "An integrator helps a corporate design, select, implement and optimise treasury technology. It provides project management, system integration, data migration, change management and ongoing support, bridging treasury requirements and the chosen platform.",
    },
    {
      q: "Why is the integrator as important as the software?",
      a: "Even the best system fails with a poor implementation. The integrator brings methodology, platform expertise and change management that decide whether a project lands on time and delivers value, so the choice is as consequential as the software itself.",
    },
    {
      q: "Should I use the vendor's team or an independent integrator?",
      a: "Both models exist. Vendor teams know their product deeply, while independent integrators can offer objectivity across platforms. Weigh platform expertise, track record on comparable projects, team seniority and continuity, and the post go-live support model.",
    },
    {
      q: "How do I choose a treasury integrator?",
      a: "Look for proven expertise on your chosen TMS or ERP, a track record on similar treasury projects, a clear methodology for migration and change management, senior and stable staffing, and independence appropriate to your situation.",
    },
  ],
  OTS: [
    {
      q: "What are 'other' treasury solutions?",
      a: "These are specialist tools that solve a specific treasury problem outside the core categories: bank fee analysis, KYC automation, guarantees management, sanctions and fraud screening, multilateral netting, signature-power digitisation and similar workflows.",
    },
    {
      q: "What is bank fee analysis software?",
      a: "It reviews bank billing statements (often in the TWIST BSB format) to check that charges match agreed pricing, flags errors and overbilling, and gives treasury visibility and negotiating leverage over its banking costs.",
    },
    {
      q: "Do these tools replace a TMS?",
      a: "No. They complement the core stack by handling a narrow, often painful task the TMS does not cover well. The aim is to fill a specific gap rather than overlap with existing systems.",
    },
    {
      q: "When is a specialist treasury tool worth it?",
      a: "When the problem it solves carries real risk or cost (sanctions screening, fraud, fee leakage, KYC) and the effort to implement it is small next to the pain removed. Fit with your existing TMS or ERP matters most.",
    },
  ],
  ERP: [
    {
      q: "Can an ERP replace a TMS for treasury?",
      a: "For many mid-market companies the ERP treasury module is the treasury system, covering cash, payments and bank connectivity with deep integration to financial data. Functional depth for risk, hedging and forecasting is usually lower than a dedicated TRMS.",
    },
    {
      q: "What treasury functions does an ERP module cover?",
      a: "Typically core cash management, payments, bank connectivity and basic risk management, tightly linked to the company's accounting data. The exact depth varies by ERP, so it is important to map where the module ends.",
    },
    {
      q: "When should I add a specialist TMS to my ERP?",
      a: "When treasury needs outgrow the module, for example complex hedging and hedge accounting, multi-bank connectivity at scale, sophisticated forecasting or detailed risk analytics. The trigger is functional gaps, not company size alone.",
    },
    {
      q: "ERP treasury module versus a standalone TMS?",
      a: "The ERP module wins on data integration and lower reconciliation overhead; the standalone TMS wins on functional depth and treasury-specific capability. The right answer depends on your risk profile, bank footprint and total cost of ownership.",
    },
  ],
  OUT: [
    {
      q: "What is treasury outsourcing?",
      a: "It is sub-contracting part or all of treasury operations to a third party that uses expert teams and dedicated technology to execute processes on your behalf under defined service-level agreements, while governance stays with your company.",
    },
    {
      q: "What can be outsourced in treasury?",
      a: "Scope ranges from a single activity such as FX dealing to cash management, payments and reporting, up to running the full treasury function. The boundary is set by the SLA and the controls you choose to retain.",
    },
    {
      q: "How is outsourcing different from treasury consulting?",
      a: "Consulting is advisory: the consultant recommends and the company acts. Outsourcing is execution: the provider actually performs treasury operations on your behalf. They solve different needs and are often used together.",
    },
    {
      q: "Do I lose control if I outsource treasury?",
      a: "Not if it is structured well. Governance, policy and oversight stay with you, defined by SLAs, reporting transparency, segregation of duties and audit rights. Clear exit and reversibility terms keep you in control of the relationship.",
    },
  ],
  ETL: [
    {
      q: "What is ETL in a treasury context?",
      a: "ETL (extract, transform, load) is data integration that pulls financial data from source systems (ERP, banks, trading platforms, market data), standardises it, and loads it into treasury or reporting systems. It is the connective tissue behind a clean treasury dataset.",
    },
    {
      q: "Why does treasury need ETL?",
      a: "Treasury data lives in many systems that do not naturally talk to each other. ETL aggregates cash positions, consolidates exposures and feeds forecasting and risk platforms, so treasurers spend time on decisions rather than manual spreadsheet work.",
    },
    {
      q: "How is ETL different from a bank connectivity gateway?",
      a: "A gateway moves messages between the company and its banks; ETL transforms and consolidates data from many sources (including banks) into a usable model for treasury and reporting. They are complementary layers, not substitutes.",
    },
    {
      q: "Real-time API pipelines or batch ETL?",
      a: "Batch suits periodic consolidation and reporting; real-time API pipelines suit intraday cash visibility and event-driven processes. Modern solutions increasingly offer both, and the right choice follows how fresh your data actually needs to be.",
    },
  ],
  FSC: [
    {
      q: "What is financial supply chain finance?",
      a: "Financial supply chain solutions optimise the financial flows between buyers and suppliers. They include supply chain finance (reverse factoring), dynamic discounting, receivables finance and payables optimisation, all aimed at freeing working capital.",
    },
    {
      q: "What is reverse factoring (supply chain finance)?",
      a: "In reverse factoring, a funder pays a company's suppliers early based on approved invoices, while the buyer pays the funder at the original due date. Suppliers get faster cash and the buyer can extend or maintain payment terms.",
    },
    {
      q: "What is dynamic discounting?",
      a: "Dynamic discounting lets a buyer pay suppliers early in exchange for a discount that scales with how early the payment is made. It uses the company's own cash to earn a return while improving supplier liquidity.",
    },
    {
      q: "Is supply chain finance on or off balance sheet?",
      a: "It depends on how the programme is structured, and accounting and disclosure treatment has drawn increasing scrutiny. Treasurers should confirm the treatment with auditors early, since it affects reported debt and working-capital metrics.",
    },
  ],
  eBAM: [
    {
      q: "What is Electronic Bank Account Management (eBAM)?",
      a: "eBAM automates the lifecycle of bank accounts between a company and its banks: opening and closing accounts, and maintaining details such as signatories and spending limits, plus the reports required by law or regulation, through standardised electronic messages.",
    },
    {
      q: "What problem does eBAM solve?",
      a: "Managing bank accounts by paper and email is slow, error-prone and a real fraud and audit risk, especially across many banks and jurisdictions. eBAM gives treasury a controlled, auditable, standardised process for the whole account lifecycle.",
    },
    {
      q: "What standards does eBAM use?",
      a: "eBAM automation is defined by SWIFT and the ISO 20022 standard, using the acmt message family for account management, which lets companies and banks exchange account instructions in a consistent, machine-readable form.",
    },
    {
      q: "Do all banks support eBAM?",
      a: "Adoption is uneven, so bank coverage is a key selection criterion. Many treasuries phase eBAM in with their most important banks first and keep controlled manual processes where a bank does not yet support the standard.",
    },
  ],
  TR: [
    {
      q: "What is treasury reporting software?",
      a: "It provides dashboards, reports and analytics on cash positions, risk exposures, hedging, investments and liquidity, consolidating data from the TMS, ERP, banks and market data into management information for CFOs, boards and treasury teams.",
    },
    {
      q: "What should a treasury dashboard show?",
      a: "Typically consolidated cash by bank and currency, liquidity and debt positions, FX and interest-rate exposures, hedging status and investment performance, with drill-down from summary figures to the underlying transactions.",
    },
    {
      q: "Standalone reporting tool or a TMS module?",
      a: "A TMS module reuses data already in the system and is simpler to run; a standalone BI or analytics tool can pull from many sources and offer richer, more flexible dashboards. The choice depends on your existing stack and reporting demands.",
    },
    {
      q: "Real-time or periodic treasury reporting?",
      a: "Real-time reporting supports intraday cash and risk decisions, while periodic reporting suits board packs and regulatory filings. Most treasuries need both, so how fresh each report must be should drive the requirement.",
    },
  ],
  PSP: [
    {
      q: "What is a Payment Service Provider (PSP)?",
      a: "A PSP is a third party that lets businesses accept electronic payments such as card and bank-based payments. It acts as an intermediary between payers and the merchant, providing the payment gateway or processor plus related services.",
    },
    {
      q: "How is a PSP different from a bank?",
      a: "A bank holds accounts and settles funds; a PSP focuses on accepting and processing payments across many methods and often many countries, adding gateways, fraud tools, FX and reporting. Many companies use both together.",
    },
    {
      q: "When does a corporate treasury need a PSP?",
      a: "Whenever the business accepts payments online or across borders, for example e-commerce, marketplaces or international sales. The PSP is where money enters the business, so it belongs on the treasury risk register.",
    },
    {
      q: "What should treasurers evaluate in a PSP?",
      a: "Acceptance methods and geographic reach, FX handling and cross-border cost, settlement speed and reconciliation, fraud and chargeback management, the full fee stack including FX margin, and integration with the ERP or TMS and reporting.",
    },
  ],
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
    faq: CATEGORY_FAQ[m.code] || [],
  };
});

export const CATEGORY_BY_SLUG = Object.fromEntries(CATEGORIES.map((c) => [c.slug, c]));
export const CATEGORY_BY_CODE = Object.fromEntries(CATEGORIES.map((c) => [c.code, c]));
export const CATEGORY_BY_ID = Object.fromEntries(CATEGORIES.map((c) => [c.id, c]));

// Static per-category presentation metadata (code / full name / hue).
// Keyed by the backend `categoryKey` (category-1 .. category-15).
// Values are taken verbatim from the validated design mock (treasurymap-A).
// The hue drives the aura / dot / glow colours of each category sector.
export const CAT_META = {
  "category-1": { code: "FIDP", full: "Financial Instrument Dealing Platform", hue: 290 },
  "category-2": { code: "FDF", full: "Financial Data Feeding", hue: 185 },
  "category-3": { code: "CMA", full: "Currency Management Automation", hue: 265 },
  "category-4": { code: "INT", full: "Integrators", hue: 55 },
  "category-5": { code: "OTS", full: "Other Treasury Solutions", hue: 175 },
  "category-6": { code: "TRMS", full: "Treasury Risk Management System", hue: 190 },
  "category-7": { code: "ERP", full: "Enterprise Resource Planning", hue: 230 },
  "category-8": { code: "OUT", full: "Outsourcing", hue: 20 },
  "category-9": { code: "ETL", full: "Extract Transform Load", hue: 150 },
  "category-10": { code: "FSC", full: "Financial Supply Chain", hue: 40 },
  "category-11": { code: "CFF", full: "Cash-Flow Forecasting", hue: 215 },
  "category-12": { code: "eBAM", full: "Electronic Bank Account Management", hue: 165 },
  "category-13": { code: "BSG", full: "Bank Single Gateway", hue: 200 },
  "category-14": { code: "TR", full: "Treasury Reporting", hue: 205 },
  "category-15": { code: "PSP", full: "Payment Service Provider", hue: 35 },
};

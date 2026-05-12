// Server component — metadata SEO/OG pour /compare-tools.

const TITLE = "Compare Tools | TreasuryMap";
const DESCRIPTION =
  "Compare 2 to 5 treasury technology vendors side-by-side, within the same category. Multi-criteria table, plus/minus per vendor, delivered as a branded PDF — no recommendation, just facts.";
const URL = "https://treasurymap.com/compare-tools";

export const metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: URL,
    siteName: "TreasuryMap",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: TITLE,
    description: DESCRIPTION,
  },
  alternates: { canonical: URL },
};

export default function CompareToolsLayout({ children }) {
  return children;
}

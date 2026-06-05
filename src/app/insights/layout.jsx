const TITLE = "Insights | TreasuryMap";
const DESCRIPTION =
  "Articles, videos and research on treasury technology · curated insights from the TreasuryMap community and the Treasury Technology Landscape.";
const URL = "https://treasurymap.com/insights";

export const metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: { title: TITLE, description: DESCRIPTION, url: URL, siteName: "TreasuryMap", type: "website" },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

export default function InsightsLayout({ children }) {
  return children;
}

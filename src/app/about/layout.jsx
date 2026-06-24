const TITLE = "About TreasuryMap | The Independent Treasury Technology Map";
const DESCRIPTION =
  "TreasuryMap is the independent, practitioner-curated map of treasury technology for European corporates. Neutral, free for treasurers, 15 categories, 100+ vendors.";
const URL = "https://treasurymap.com/about";

export const metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: { title: TITLE, description: DESCRIPTION, url: URL, siteName: "TreasuryMap", type: "website" },
  twitter: { card: "summary", title: TITLE, description: DESCRIPTION },
};

export default function AboutLayout({ children }) {
  return children;
}

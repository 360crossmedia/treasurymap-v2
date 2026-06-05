// Server component — exporte les metadata SEO + Open Graph pour /get-my-list.
// Le layout délègue children à la page (qui reste un client component).

const TITLE = "Build my shortlist | TreasuryMap";
const DESCRIPTION =
  "Answer 10 quick questions and receive a personalised consultant-style report of treasury solutions matched to your profile. Based on the Treasury Technology Map. Delivered by email in minutes.";
const URL = "https://treasurymap.com/get-my-list";

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
  alternates: {
    canonical: URL,
  },
};

export default function GetMyListLayout({ children }) {
  return children;
}

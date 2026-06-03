const TITLE = "Contact us | TreasuryMap";
const DESCRIPTION =
  "Get in touch with the TreasuryMap team at Simply Treasury. Questions about the Treasury Technology Landscape, your vendor profile, or partnerships — we'll get back to you.";
const URL = "https://treasurymap.com/contactUs";

export const metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: { title: TITLE, description: DESCRIPTION, url: URL, siteName: "TreasuryMap", type: "website" },
  twitter: { card: "summary", title: TITLE, description: DESCRIPTION },
};

export default function ContactLayout({ children }) {
  return children;
}

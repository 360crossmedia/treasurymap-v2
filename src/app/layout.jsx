import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Inter } from "next/font/google";
import "./styles/globals.css";
import Providers from "./store/Providers";
import "bootstrap/dist/css/bootstrap.min.css";
import { PrimeReactProvider } from "primereact/api";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import LoadingLogic from "./components/LoadingLogic";
import LoadingScreen from "./components/LoadingScreen";
import ProtectedRoutes from "./components/ProtectedRoutes";
import StyledJsxRegistry from "./StyledJsxRegistry";
import Script from 'next/script';

const inter = Inter({ subsets: ["latin"] });

const SITE_NAME = "TreasuryMap";
// Public site origin · drives metadataBase, canonicals, robots and sitemap.
// Same fallback as providers/[slug]/page.jsx and app/sitemap.js.
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://treasurymap-v2-production.up.railway.app";
const DEFAULT_DESCRIPTION =
  "TreasuryMap is the independent, practitioner-curated map of treasury technology in Europe: find TMS, payments, FX and bank-connectivity providers in one interactive map.";
const DEFAULT_OG_IMAGE =
  "https://res.cloudinary.com/dq7aof6vb/image/upload/f_auto,q_auto,w_1200/v1739685416/MultiplayerMapBg_z1htg0.png";

// Bump this when the icons change to force browsers to re-fetch (favicons are
// cached very aggressively, especially by Safari).
const ICON_V = "7";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "TreasuryMap · Independent Treasury Technology Map for Europe",
    template: `%s | ${SITE_NAME}`,
  },
  description: DEFAULT_DESCRIPTION,
  alternates: { canonical: "/" },
  verification: {
    // Google Search Console · URL-prefix property (HTML tag method).
    google: "RdmpWCorAO71Ej8qDaf7CDyUth6mXccCoIdsfdJwvK4",
  },
  icons: {
    icon: [
      { url: `/icon.svg?v=${ICON_V}`, type: "image/svg+xml" },
      { url: `/favicon.ico?v=${ICON_V}`, sizes: "any", type: "image/x-icon" },
    ],
    apple: [{ url: `/apple-icon.png?v=${ICON_V}` }],
    shortcut: [{ url: `/favicon.ico?v=${ICON_V}` }],
  },
  openGraph: {
    title: SITE_NAME,
    description: DEFAULT_DESCRIPTION,
    url: SITE_URL,
    type: "website",
    siteName: SITE_NAME,
    images: [DEFAULT_OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: DEFAULT_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE],
  },
};

// Identity structured data (Organization + WebSite + Person). Tells search
// engines and LLMs "who TreasuryMap is", which the SEO/GEO audit flagged as
// missing on the home page.
const STRUCTURED_DATA = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: SITE_NAME,
      url: SITE_URL,
      logo: `${SITE_URL}/icon.svg`,
      description:
        "The independent, practitioner-curated map of treasury technology in Europe.",
      founder: { "@id": `${SITE_URL}/#francois` },
      sameAs: ["https://www.simplytreasury.com"],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SITE_NAME,
      publisher: { "@id": `${SITE_URL}/#organization` },
    },
    {
      "@type": "Person",
      "@id": `${SITE_URL}/#francois`,
      name: "François Masquelier",
      jobTitle: "Founder, TreasuryMap",
      description:
        "Founder of Simply Treasury, Chairman of ATEL and EACT, 28+ years in corporate treasury.",
      worksFor: { "@id": `${SITE_URL}/#organization` },
      sameAs: ["https://www.simplytreasury.com"],
    },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Load the home/map fonts early (preconnect + head stylesheet) so the
            web-font swap happens at/before first paint instead of after the map
            client component mounts. Loading them late was reflowing the header
            and pushing the whole page down · the main cause of homepage CLS. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Chivo:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&family=Oswald:wght@300;400;500;600;700&display=swap"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(STRUCTURED_DATA) }}
        />
        <Script
          strategy="lazyOnload"
          src="https://www.googletagmanager.com/gtag/js?id=G-3NPV4E3WWW"
        />
        <Script
          id="google-analytics"
          strategy="lazyOnload"
        >
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-3NPV4E3WWW');
          `}
        </Script>
      </head>
      <PrimeReactProvider value={{ unstyled: false }}>
        <Providers>
          <ProtectedRoutes>
            <body className={inter.className}>
              <StyledJsxRegistry>
                <LoadingLogic>
                  <LoadingScreen />
                </LoadingLogic>
                {children}
              </StyledJsxRegistry>
              <Analytics />
              <SpeedInsights />
            </body>
          </ProtectedRoutes>
        </Providers>
      </PrimeReactProvider>
    </html>
  );
}

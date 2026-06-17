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
import Script from 'next/script';

const inter = Inter({ subsets: ["latin"] });

const SITE_NAME = "TreasuryMap";
// Public site origin · drives metadataBase, canonicals, robots and sitemap.
// Same fallback as providers/[slug]/page.jsx and app/sitemap.js.
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://treasurymap-v2-production.up.railway.app";
const DEFAULT_DESCRIPTION =
  "The Treasury Technology Landscape · discover treasury solutions, providers and integrators in one interactive map.";
const DEFAULT_OG_IMAGE =
  "https://res.cloudinary.com/dq7aof6vb/image/upload/f_auto,q_auto,w_1200/v1739685416/MultiplayerMapBg_z1htg0.png";

// Bump this when the icons change to force browsers to re-fetch (favicons are
// cached very aggressively, especially by Safari).
const ICON_V = "7";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: SITE_NAME, template: `%s | ${SITE_NAME}` },
  description: DEFAULT_DESCRIPTION,
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

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-3NPV4E3WWW"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
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
              <LoadingLogic>
                <LoadingScreen />
              </LoadingLogic>
              {children}
              <Analytics />
              <SpeedInsights />
            </body>
          </ProtectedRoutes>
        </Providers>
      </PrimeReactProvider>
    </html>
  );
}

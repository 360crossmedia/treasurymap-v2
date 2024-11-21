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

export const metadata = {
  title: "Treasurymap",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-T4FXYK0D5J"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
        >
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-T4FXYK0D5J');
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

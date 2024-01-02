import { Inter } from "next/font/google";
import "./styles/globals.css";
import Providers from "./store/Providers";
import "bootstrap/dist/css/bootstrap.min.css";
import { PrimeReactProvider } from "primereact/api";
import "primereact/resources/themes/lara-light-cyan/theme.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Treasurymap",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <PrimeReactProvider value={{ unstyled: false }}>
        <Providers>
          <body className={inter.className}>{children}</body>
        </Providers>
      </PrimeReactProvider>
    </html>
  );
}

import { Inter } from "next/font/google";
import "./styles/globals.css";
import Providers from "./store/Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Treasurymap",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Providers>
        <body className={inter.className}>{children}</body>
      </Providers>
    </html>
  );
}

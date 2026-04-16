import Link from "next/link";
import Image from "next/image";

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <Image
            src="/assets/logo.svg"
            alt="TreasuryMap logo"
            width={200}
            height={34}
            priority
          />
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-sm font-medium text-gray-600 hover:text-[#1B4B6B] transition-colors">
            Be on the map
          </Link>
          <Link href="/contact" className="text-sm font-medium text-gray-600 hover:text-[#1B4B6B] transition-colors">
            Contact us
          </Link>
          <Link href="/insights" className="text-sm font-medium text-gray-600 hover:text-[#1B4B6B] transition-colors">
            Insights
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/signup"
            className="text-sm font-medium px-5 py-2 rounded-full bg-[#1B4B6B] hover:bg-[#153D58] text-white transition-colors"
          >
            Log In
          </Link>
        </div>
      </div>
    </header>
  );
}

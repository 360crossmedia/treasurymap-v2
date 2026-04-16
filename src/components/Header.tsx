import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-[#0A0F1C]/90 backdrop-blur-md border-b border-[#1E293B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#6C5CE7] flex items-center justify-center">
            <span className="text-white font-black text-xs">TM</span>
          </div>
          <span className="text-lg font-bold text-white">
            Treasury<span className="text-[#6C5CE7]">Map</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-sm text-[#94A3B8] hover:text-white transition-colors">
            Map
          </Link>
          <Link href="/insights" className="text-sm text-[#94A3B8] hover:text-white transition-colors">
            Insights
          </Link>
          <Link href="/contact" className="text-sm text-[#94A3B8] hover:text-white transition-colors">
            Contact
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/signup"
            className="text-sm font-medium px-4 py-2 rounded-lg bg-[#6C5CE7] hover:bg-[#5A4BD1] text-white transition-colors"
          >
            Get Listed
          </Link>
        </div>
      </div>
    </header>
  );
}

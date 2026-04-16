import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-[#1E293B] bg-[#0A0F1C] py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-md bg-[#6C5CE7] flex items-center justify-center">
                <span className="text-white font-black text-[10px]">TM</span>
              </div>
              <span className="text-sm font-bold text-white">TreasuryMap</span>
            </div>
            <p className="text-xs text-[#64748B] max-w-xs">
              The interactive directory of treasury technology solutions. Explore, compare, and connect.
            </p>
          </div>

          <div className="flex gap-12">
            <div>
              <h4 className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-3">Platform</h4>
              <div className="flex flex-col gap-2">
                <Link href="/" className="text-xs text-[#64748B] hover:text-white transition-colors">Map</Link>
                <Link href="/insights" className="text-xs text-[#64748B] hover:text-white transition-colors">Insights</Link>
                <Link href="/signup" className="text-xs text-[#64748B] hover:text-white transition-colors">Get Listed</Link>
              </div>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-3">Company</h4>
              <div className="flex flex-col gap-2">
                <Link href="/contact" className="text-xs text-[#64748B] hover:text-white transition-colors">Contact</Link>
                <span className="text-xs text-[#64748B]">GDPR</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-[#1E293B] flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-[11px] text-[#475569]">
            Simply Treasury | 1 rue de Chiny, L-1334 Luxembourg
          </p>
          <p className="text-[11px] text-[#475569]">
            Powered by 360Crossmedia
          </p>
        </div>
      </div>
    </footer>
  );
}

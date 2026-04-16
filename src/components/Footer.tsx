import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="border-t bg-gray-50 py-8">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">Official partners</span>
          </div>
          <div className="flex items-center gap-6 text-xs text-gray-400">
            <Link href="/contact" className="hover:text-gray-600">GDPR</Link>
            <span>Simply Treasury | 1 rue de Chiny, L-1334 Luxembourg</span>
            <span>Powered by 360Crossmedia</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

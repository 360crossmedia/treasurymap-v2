import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Insights — TreasuryMap",
  description: "Articles, analysis, and insights on treasury technology, cash management, and financial solutions.",
};

export default function InsightsPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-white">Insights</h1>
        <p className="mt-3 text-[#94A3B8] max-w-lg mx-auto">
          Articles and analysis on treasury technology, cash management, and financial solutions.
        </p>
      </div>

      {/* Empty state — will be populated when article system is connected */}
      <div className="bg-[#1A2332] border border-[#1E293B] rounded-xl p-12 text-center">
        <div className="w-16 h-16 rounded-2xl bg-[#6C5CE7]/10 flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-[#6C5CE7]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
          </svg>
        </div>
        <h2 className="text-lg font-semibold text-white mb-2">Coming Soon</h2>
        <p className="text-sm text-[#64748B] max-w-sm mx-auto">
          Our insights section is being prepared. Check back soon for articles on treasury technology trends and best practices.
        </p>
      </div>
    </div>
  );
}

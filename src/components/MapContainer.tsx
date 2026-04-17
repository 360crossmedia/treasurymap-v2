// MAP CORE — do not refactor without explicit instruction
"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import type { MapCategory } from "@/lib/api";

const CATS: Record<number, { label: string; color: string }> = {
  0:  { label: "FIDP",        color: "#3B82F6" },
  1:  { label: "FDF",         color: "#818CF8" },
  2:  { label: "CMA",         color: "#F472B6" },
  3:  { label: "Integrators", color: "#34D399" },
  4:  { label: "OTS",         color: "#FBBF24" },
  5:  { label: "TMS",         color: "#22D3EE" },
  6:  { label: "BI",          color: "#A78BFA" },
  7:  { label: "ERP",         color: "#F87171" },
  8:  { label: "ETL",         color: "#2DD4BF" },
  9:  { label: "FSC",         color: "#FB923C" },
  10: { label: "CFF",         color: "#C084FC" },
  11: { label: "RegTech",     color: "#38BDF8" },
  12: { label: "Banking",     color: "#4ADE80" },
  13: { label: "Insurance",   color: "#FB7185" },
  14: { label: "Other",       color: "#94A3B8" },
};

// Max logos per category — matches the current live site (113 total)
const MAX_LOGOS: Record<number, number> = {
  0: 4, 1: 2, 2: 7, 3: 4, 4: 15, 5: 18, 6: 3, 7: 1, 8: 4, 9: 5, 10: 15, 11: 7, 12: 10, 13: 15, 14: 3,
};

// Cluster positions — percentage based, spread like a galaxy
const POS: Record<number, [number, number]> = {
  5:  [50, 45], // TMS center (largest)
  0:  [18, 15], 1: [82, 12], 2: [85, 55],
  3:  [50, 15], 4: [12, 48], 6: [32, 80],
  7:  [68, 82], 8: [90, 82], 9: [50, 85],
  10: [12, 80], 11: [12, 30], 12: [78, 35],
  13: [35, 38], 14: [90, 30],
};

interface Props { initialData?: MapCategory[] }

export function MapContainer({ initialData }: Props) {
  const [data, setData] = useState<MapCategory[]>(initialData || []);
  const [loading, setLoading] = useState(!initialData);
  const [search, setSearch] = useState("");
  const [focused, setFocused] = useState<number | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  useEffect(() => {
    if (!initialData) {
      fetch("https://treasurymapbackend-production.up.railway.app/api/v1/mapdata")
        .then(r => r.json()).then(d => { setData(d); setLoading(false); })
        .catch(() => setLoading(false));
    }
  }, [initialData]);

  const filtered = useMemo(() => data.map(cat => ({
    ...cat,
    logos: cat.logos.filter(l => {
      if (!l.live) return false;
      if (search && !l.keywords?.some(k => k.toLowerCase().includes(search.toLowerCase()))) return false;
      return true;
    }),
  })), [data, search]);

  const total = filtered.reduce((a, c) => a + c.logos.length, 0);

  // Spiral positions for logos in a cluster
  function spiral(n: number, spread: number) {
    const pts: [number, number][] = [];
    const ga = 137.508 * Math.PI / 180;
    for (let i = 0; i < n; i++) {
      const r = spread * Math.sqrt(i + 0.5);
      const t = i * ga;
      pts.push([r * Math.cos(t), r * Math.sin(t)]);
    }
    return pts;
  }

  if (loading) return (
    <div className="flex items-center justify-center h-[80vh] bg-[#060a14]">
      <div className="w-8 h-8 border-2 border-gray-800 border-t-cyan-500 rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="bg-[#060a14] min-h-screen">
      {/* Search */}
      <div className="sticky top-16 z-40 bg-[#060a14]/90 backdrop-blur-xl border-b border-white/[0.03]">
        <div className="max-w-7xl mx-auto px-5 py-3 flex items-center gap-3">
          <div className="relative flex-1 max-w-xs">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input type="text" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)}
              className="w-full bg-white/[0.04] border border-white/[0.06] rounded-lg pl-9 pr-3 py-2 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-white/10" />
          </div>
          <span className="text-[11px] text-gray-600 ml-auto">{total} companies</span>
        </div>
      </div>

      {/* Map */}
      <div className="relative w-full overflow-hidden" style={{ height: "max(78vh, 650px)" }}>
        {/* Subtle center glow */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 50% 45%, rgba(6,182,212,0.04) 0%, transparent 50%)" }} />

        {filtered.filter(c => c.logos.length > 0).map(cat => {
          const meta = CATS[cat.id];
          const pos = POS[cat.id];
          if (!meta || !pos) return null;

          const isFocused = focused === cat.id;
          const isDimmed = focused !== null && !isFocused;
          const maxShow = MAX_LOGOS[cat.id] || 5;
          const showCount = isFocused ? Math.min(cat.logos.length, maxShow * 2) : Math.min(cat.logos.length, maxShow);
          const spread = Math.min(14, 5 + showCount * 0.25);
          const pts = spiral(showCount, spread);
          const scale = isFocused ? 1.6 : isDimmed ? 0.7 : 1;

          return (
            <div key={cat.id} className="absolute transition-all duration-700 ease-out"
              style={{
                left: `${pos[0]}%`, top: `${pos[1]}%`,
                transform: `translate(-50%,-50%) scale(${scale})`,
                opacity: isDimmed ? 0.15 : 1,
                zIndex: isFocused ? 20 : 1,
              }}
              onMouseEnter={() => setFocused(cat.id)}
              onMouseLeave={() => setFocused(null)}
            >
              {/* Glow */}
              <div className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none transition-all duration-700"
                style={{
                  left: 0, top: 0,
                  width: isFocused ? 350 : 200, height: isFocused ? 350 : 200,
                  marginLeft: isFocused ? -175 : -100, marginTop: isFocused ? -175 : -100,
                  background: `radial-gradient(circle, ${meta.color}${isFocused ? "15" : "08"} 0%, transparent 70%)`,
                }} />

              {/* Label */}
              <div className="absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none z-10">
                <div className="text-[10px] font-semibold tracking-widest uppercase" style={{ color: meta.color }}>{meta.label}</div>
                <div className="text-[8px] text-gray-600 mt-0.5">{cat.logos.length}</div>
              </div>

              {/* Logos */}
              {pts.map(([dx, dy], i) => {
                const logo = cat.logos[i];
                if (!logo) return null;
                const cid = logo.url?.match(/companyPage\/(\d+)/)?.[1];
                const k = `${cat.id}-${i}`;
                const isH = hovered === k;
                const sz = isFocused ? 32 : 24;

                return (
                  <Link key={k} href={cid ? `/company/${cid}` : "#"}
                    className="absolute transition-all duration-500"
                    style={{ left: dx - sz/2, top: dy - sz/2, zIndex: isH ? 30 : 2 }}
                    onMouseEnter={() => setHovered(k)}
                    onMouseLeave={() => setHovered(null)}
                  >
                    <div className="rounded-md overflow-hidden transition-all duration-200"
                      style={{
                        width: sz, height: sz,
                        background: "#fff",
                        boxShadow: isH ? `0 0 0 1.5px ${meta.color}, 0 4px 16px rgba(0,0,0,0.6)` : "0 1px 3px rgba(0,0,0,0.4)",
                        transform: isH ? "scale(1.5)" : "scale(1)",
                      }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={logo.image || ""} alt="" loading="lazy"
                        className="w-full h-full object-contain p-[3px]"
                        onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                    </div>
                    {isH && (
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 pointer-events-none z-50">
                        <div className="px-2 py-1 rounded text-[9px] font-medium text-white whitespace-nowrap"
                          style={{ backgroundColor: meta.color }}>
                          {(logo.keywords?.[0] || "View").substring(0, 22)}
                        </div>
                      </div>
                    )}
                  </Link>
                );
              })}

              {/* Overflow */}
              {!isFocused && cat.logos.length > 16 && (
                <div className="absolute text-[9px] font-medium cursor-pointer" style={{ color: `${meta.color}80`, left: spread * 4.5, top: 0 }}>
                  +{cat.logos.length - 16}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="max-w-5xl mx-auto px-6 py-6 flex flex-wrap justify-center gap-2">
        {Object.entries(CATS).map(([id, m]) => {
          const c = filtered.find(c => c.id === parseInt(id));
          if (!c || c.logos.length === 0) return null;
          return (
            <button key={id} className="flex items-center gap-1.5 px-2.5 py-1 rounded text-[10px] text-gray-500 hover:text-gray-300 hover:bg-white/[0.03] transition-all"
              onMouseEnter={() => setFocused(parseInt(id))} onMouseLeave={() => setFocused(null)}>
              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: m.color }} />
              {m.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

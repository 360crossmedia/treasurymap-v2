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

const MAX_LOGOS: Record<number, number> = {
  0: 4, 1: 2, 2: 7, 3: 4, 4: 15, 5: 18, 6: 3, 7: 1, 8: 4, 9: 5, 10: 15, 11: 7, 12: 10, 13: 15, 14: 3,
};

const POS: Record<number, [number, number]> = {
  5:  [50, 46],
  0:  [18, 14], 1: [82, 12], 2: [84, 54],
  3:  [50, 14], 4: [13, 50], 6: [30, 82],
  7:  [68, 84], 8: [90, 84], 9: [50, 86],
  10: [10, 82], 11: [13, 30], 12: [80, 34],
  13: [36, 36], 14: [92, 30],
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

  const shownTotal = filtered.reduce((a, c) => a + Math.min(c.logos.length, MAX_LOGOS[c.id] || 5), 0);

  // Circular layout around center — more spread, no overlap
  function circleLayout(n: number, radius: number) {
    const pts: [number, number][] = [];
    for (let i = 0; i < n; i++) {
      const angle = (i / n) * Math.PI * 2 - Math.PI / 2;
      pts.push([radius * Math.cos(angle), radius * Math.sin(angle)]);
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
          <span className="text-[11px] text-gray-600 ml-auto">{shownTotal} companies</span>
        </div>
      </div>

      {/* Map */}
      <div className="relative w-full overflow-hidden" style={{ height: "max(78vh, 650px)" }}>
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 50% 45%, rgba(6,182,212,0.03) 0%, transparent 50%)" }} />

        {filtered.filter(c => c.logos.length > 0).map(cat => {
          const meta = CATS[cat.id];
          const pos = POS[cat.id];
          if (!meta || !pos) return null;

          const isFocused = focused === cat.id;
          const isDimmed = focused !== null && !isFocused;
          const maxShow = MAX_LOGOS[cat.id] || 5;
          const showLogos = cat.logos.slice(0, isFocused ? maxShow * 2 : maxShow);
          const radius = isFocused ? Math.max(60, showLogos.length * 5) : Math.max(40, showLogos.length * 4);
          const pts = circleLayout(showLogos.length, radius);
          const scale = isFocused ? 1.3 : isDimmed ? 0.75 : 1;

          return (
            <div key={cat.id} className="absolute transition-all duration-700 ease-out"
              style={{
                left: `${pos[0]}%`, top: `${pos[1]}%`,
                transform: `translate(-50%,-50%) scale(${scale})`,
                opacity: isDimmed ? 0.12 : 1,
                zIndex: isFocused ? 20 : 1,
              }}
              onMouseEnter={() => setFocused(cat.id)}
              onMouseLeave={() => setFocused(null)}
            >
              {/* Glow */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none transition-all duration-700"
                style={{
                  width: radius * 4, height: radius * 4,
                  background: `radial-gradient(circle, ${meta.color}${isFocused ? "12" : "06"} 0%, transparent 70%)`,
                }} />

              {/* Category label — CENTERED, above logos */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none z-10">
                <div className="text-[12px] font-bold tracking-wider uppercase whitespace-nowrap" style={{ color: meta.color }}>
                  {meta.label}
                </div>
              </div>

              {/* Logos in circle around label */}
              {pts.map(([dx, dy], i) => {
                const logo = showLogos[i];
                if (!logo) return null;
                const cid = logo.url?.match(/companyPage\/(\d+)/)?.[1];
                const k = `${cat.id}-${i}`;
                const isH = hovered === k;
                const sz = isFocused ? 36 : 28;

                return (
                  <Link key={k} href={cid ? `/company/${cid}` : "#"}
                    className="absolute transition-all duration-500"
                    style={{ left: dx - sz/2, top: dy - sz/2, zIndex: isH ? 30 : 2 }}
                    onMouseEnter={() => setHovered(k)}
                    onMouseLeave={() => setHovered(null)}
                  >
                    <div className="rounded-full overflow-hidden transition-all duration-200 border-2"
                      style={{
                        width: sz, height: sz,
                        background: "rgba(255,255,255,0.95)",
                        borderColor: isH ? meta.color : "rgba(255,255,255,0.15)",
                        boxShadow: isH ? `0 0 12px ${meta.color}60` : "0 2px 8px rgba(0,0,0,0.4)",
                        transform: isH ? "scale(1.5)" : "scale(1)",
                      }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={logo.image || ""} alt="" loading="lazy"
                        className="w-full h-full object-contain p-[4px] rounded-full"
                        onError={e => { (e.target as HTMLImageElement).style.opacity = "0"; }} />
                    </div>
                    {isH && (
                      <div className="absolute -top-9 left-1/2 -translate-x-1/2 pointer-events-none z-50">
                        <div className="px-2.5 py-1 rounded-full text-[9px] font-medium text-white whitespace-nowrap shadow-lg"
                          style={{ backgroundColor: meta.color }}>
                          {(logo.keywords?.[0] || "View").substring(0, 22)}
                        </div>
                      </div>
                    )}
                  </Link>
                );
              })}
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

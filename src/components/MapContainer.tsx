// MAP CORE — do not refactor without explicit instruction
"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import type { MapCategory } from "@/lib/api";

const CATS: Record<number, { label: string; color: string; glow: string }> = {
  0:  { label: "FIDP",        color: "#3B82F6", glow: "59,130,246" },
  1:  { label: "FDF",         color: "#818CF8", glow: "129,140,248" },
  2:  { label: "CMA",         color: "#F472B6", glow: "244,114,182" },
  3:  { label: "Integrators", color: "#34D399", glow: "52,211,153" },
  4:  { label: "OTS",         color: "#FBBF24", glow: "251,191,36" },
  5:  { label: "TMS",         color: "#22D3EE", glow: "34,211,238" },
  6:  { label: "BI",          color: "#A78BFA", glow: "167,139,250" },
  7:  { label: "ERP",         color: "#F87171", glow: "248,113,113" },
  8:  { label: "ETL",         color: "#2DD4BF", glow: "45,212,191" },
  9:  { label: "FSC",         color: "#FB923C", glow: "251,146,60" },
  10: { label: "CFF",         color: "#C084FC", glow: "192,132,252" },
  11: { label: "RegTech",     color: "#38BDF8", glow: "56,189,248" },
  12: { label: "Banking",     color: "#4ADE80", glow: "74,222,128" },
  13: { label: "Insurance",   color: "#FB7185", glow: "251,113,133" },
  14: { label: "Other",       color: "#94A3B8", glow: "148,163,184" },
};

const MAX_LOGOS: Record<number, number> = {
  0: 4, 1: 2, 2: 7, 3: 4, 4: 15, 5: 18, 6: 3, 7: 1, 8: 4, 9: 5, 10: 15, 11: 7, 12: 10, 13: 15, 14: 3,
};

// Positions spread across full viewport — use all available space
const POS: Record<number, [number, number]> = {
  5:  [50, 48],  // TMS — center, biggest
  3:  [50, 16],  // Integrators — top center
  0:  [16, 16],  // FIDP — top left
  1:  [84, 14],  // FDF — top right
  13: [30, 32],  // Insurance
  12: [72, 30],  // Banking
  11: [8, 44],   // RegTech — far left
  2:  [90, 50],  // CMA — far right
  4:  [14, 65],  // OTS
  6:  [36, 72],  // BI
  9:  [54, 78],  // FSC
  7:  [72, 74],  // ERP
  10: [8, 84],   // CFF
  8:  [88, 80],  // ETL
  14: [92, 18],  // Other
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

  function circleLayout(n: number, r: number): [number, number][] {
    return Array.from({ length: n }, (_, i) => {
      const a = (i / n) * Math.PI * 2 - Math.PI / 2;
      return [r * Math.cos(a), r * Math.sin(a)];
    });
  }

  if (loading) return (
    <div className="flex items-center justify-center h-[85vh] bg-[#050810]">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border border-cyan-500/10 animate-ping" />
        <div className="absolute inset-3 rounded-full border border-cyan-500/30 animate-spin" style={{ animationDuration: "2s" }} />
      </div>
    </div>
  );

  return (
    <div className="bg-[#050810] min-h-screen relative overflow-hidden">
      {/* Ambient background effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Mesh gradient */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full opacity-[0.015]"
          style={{ background: "radial-gradient(circle, #22D3EE, transparent 70%)", filter: "blur(80px)" }} />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full opacity-[0.012]"
          style={{ background: "radial-gradient(circle, #A78BFA, transparent 70%)", filter: "blur(80px)" }} />
        <div className="absolute top-1/3 right-1/3 w-[400px] h-[400px] rounded-full opacity-[0.01]"
          style={{ background: "radial-gradient(circle, #F472B6, transparent 70%)", filter: "blur(80px)" }} />
        {/* Dot grid */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.03]">
          <defs><pattern id="dots" width="40" height="40" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="0.5" fill="white" />
          </pattern></defs>
          <rect width="100%" height="100%" fill="url(#dots)" />
        </svg>
      </div>

      {/* Search */}
      <div className="sticky top-16 z-40 bg-[#050810]/80 backdrop-blur-2xl border-b border-white/[0.03]">
        <div className="max-w-7xl mx-auto px-5 py-3 flex items-center gap-3">
          <div className="relative flex-1 max-w-xs">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input type="text" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)}
              className="w-full bg-white/[0.03] border border-white/[0.05] rounded-xl pl-9 pr-3 py-2 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-white/10 transition-all" />
          </div>
          <span className="text-[11px] text-gray-600 ml-auto">{shownTotal} companies</span>
        </div>
      </div>

      {/* Map — full viewport */}
      <div className="relative z-10 w-full" style={{ height: "calc(100vh - 130px)", minHeight: 650 }}>
        {filtered.filter(c => c.logos.length > 0).map(cat => {
          const meta = CATS[cat.id];
          const pos = POS[cat.id];
          if (!meta || !pos) return null;

          const isFocused = focused === cat.id;
          const isDimmed = focused !== null && !isFocused;
          const maxShow = MAX_LOGOS[cat.id] || 5;
          const showLogos = cat.logos.slice(0, isFocused ? Math.min(cat.logos.length, maxShow * 2) : maxShow);
          const baseR = isFocused ? Math.max(70, showLogos.length * 6) : Math.max(44, showLogos.length * 5);
          const pts = circleLayout(showLogos.length, baseR);
          const scale = isFocused ? 1.25 : isDimmed ? 0.7 : 1;

          return (
            <div key={cat.id} className="absolute transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{
                left: `${pos[0]}%`, top: `${pos[1]}%`,
                transform: `translate(-50%,-50%) scale(${scale})`,
                opacity: isDimmed ? 0.08 : 1,
                zIndex: isFocused ? 20 : 1,
              }}
              onMouseEnter={() => setFocused(cat.id)}
              onMouseLeave={() => setFocused(null)}
            >
              {/* Orbital ring */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none transition-all duration-700 border"
                style={{
                  width: baseR * 2 + 8, height: baseR * 2 + 8,
                  borderColor: `rgba(${meta.glow}, ${isFocused ? 0.15 : 0.05})`,
                }} />

              {/* Glow orb behind cluster */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none transition-all duration-700"
                style={{
                  width: baseR * 3.5, height: baseR * 3.5,
                  background: `radial-gradient(circle, rgba(${meta.glow}, ${isFocused ? 0.1 : 0.03}) 0%, transparent 70%)`,
                }} />

              {/* Center node — category label */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center mb-1 transition-all duration-500"
                    style={{
                      background: `rgba(${meta.glow}, ${isFocused ? 0.15 : 0.08})`,
                      boxShadow: isFocused ? `0 0 30px rgba(${meta.glow}, 0.2)` : "none",
                    }}>
                    <span className="text-[9px] font-black tracking-wider" style={{ color: meta.color }}>{meta.label}</span>
                  </div>
                </div>
              </div>

              {/* Connecting lines — center to each logo */}
              <svg className="absolute left-1/2 top-1/2 pointer-events-none overflow-visible" style={{ width: 1, height: 1 }}>
                {pts.map(([dx, dy], i) => (
                  <line key={i} x1={0} y1={0} x2={dx} y2={dy}
                    stroke={meta.color} strokeOpacity={isFocused ? 0.08 : 0.03} strokeWidth="0.5" />
                ))}
              </svg>

              {/* Logos orbiting */}
              {pts.map(([dx, dy], i) => {
                const logo = showLogos[i];
                if (!logo) return null;
                const cid = logo.url?.match(/companyPage\/(\d+)/)?.[1];
                const k = `${cat.id}-${i}`;
                const isH = hovered === k;
                const sz = isFocused ? 34 : 26;

                return (
                  <Link key={k} href={cid ? `/company/${cid}` : "#"}
                    className="absolute transition-all duration-500 ease-out"
                    style={{ left: dx - sz/2, top: dy - sz/2, zIndex: isH ? 30 : 2 }}
                    onMouseEnter={() => setHovered(k)}
                    onMouseLeave={() => setHovered(null)}
                  >
                    {/* Logo node */}
                    <div className="relative transition-all duration-200"
                      style={{
                        width: sz, height: sz,
                        transform: isH ? "scale(1.6)" : "scale(1)",
                      }}>
                      {/* Outer glow ring on hover */}
                      {isH && (
                        <div className="absolute -inset-2 rounded-full animate-pulse"
                          style={{ background: `radial-gradient(circle, rgba(${meta.glow}, 0.3), transparent 70%)` }} />
                      )}
                      {/* Logo circle — frosted glass, NOT white */}
                      <div className="w-full h-full rounded-full overflow-hidden"
                        style={{
                          background: isH ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.08)",
                          backdropFilter: "blur(8px)",
                          border: `1.5px solid rgba(${meta.glow}, ${isH ? 0.6 : 0.15})`,
                          boxShadow: isH
                            ? `0 0 20px rgba(${meta.glow}, 0.4), 0 4px 12px rgba(0,0,0,0.5)`
                            : `0 0 0 0.5px rgba(${meta.glow}, 0.1)`,
                        }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={logo.image || ""} alt="" loading="lazy"
                          className="w-full h-full object-contain p-[5px] transition-all duration-200"
                          style={{ filter: isH ? "none" : "brightness(1.8) contrast(0.6)" }}
                          onError={e => { (e.target as HTMLImageElement).style.opacity = "0"; }} />
                      </div>
                    </div>

                    {/* Tooltip */}
                    {isH && (
                      <div className="absolute -top-10 left-1/2 -translate-x-1/2 pointer-events-none z-50">
                        <div className="px-3 py-1.5 rounded-lg text-[9px] font-semibold text-white whitespace-nowrap backdrop-blur-md"
                          style={{ background: `rgba(${meta.glow}, 0.85)`, boxShadow: `0 4px 20px rgba(${meta.glow}, 0.3)` }}>
                          {(logo.keywords?.[0] || "View").substring(0, 24)}
                        </div>
                        <div className="w-2 h-2 rotate-45 mx-auto -mt-1" style={{ background: `rgba(${meta.glow}, 0.85)` }} />
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
      <div className="relative z-10 max-w-5xl mx-auto px-6 py-8 flex flex-wrap justify-center gap-1.5">
        {Object.entries(CATS).map(([id, m]) => {
          const c = filtered.find(c => c.id === parseInt(id));
          if (!c || c.logos.length === 0) return null;
          const isActive = focused === parseInt(id);
          return (
            <button key={id}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-medium transition-all duration-300"
              style={{
                color: isActive ? m.color : "rgb(100,116,139)",
                background: isActive ? `rgba(${m.glow}, 0.1)` : "transparent",
                boxShadow: isActive ? `0 0 15px rgba(${m.glow}, 0.1)` : "none",
              }}
              onMouseEnter={() => setFocused(parseInt(id))}
              onMouseLeave={() => setFocused(null)}
            >
              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: m.color }} />
              {m.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

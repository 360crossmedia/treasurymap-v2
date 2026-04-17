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

// Positions — spread organically, avoid grid feel
const POS: Record<number, [number, number]> = {
  5:  [50, 46],  3:  [48, 14], 0:  [15, 13], 1:  [83, 11],
  13: [28, 33],  12: [74, 28], 11: [7, 46],  2:  [91, 50],
  4:  [16, 68],  6:  [38, 74], 9:  [56, 80], 7:  [74, 76],
  10: [6, 86],   8:  [90, 82], 14: [93, 18],
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

  // Organic spiral — golden angle with jitter for natural feel
  function organicSpiral(n: number, baseR: number, seed: number): [number, number][] {
    const pts: [number, number][] = [];
    const ga = 137.508 * Math.PI / 180;
    for (let i = 0; i < n; i++) {
      const r = baseR * Math.sqrt(i + 1) * 0.7;
      const theta = i * ga + (seed * 0.5);
      // Add slight jitter based on index for organic feel
      const jx = Math.sin(i * 7.3 + seed) * 3;
      const jy = Math.cos(i * 5.7 + seed) * 3;
      pts.push([r * Math.cos(theta) + jx, r * Math.sin(theta) + jy]);
    }
    return pts;
  }

  if (loading) return (
    <div className="flex items-center justify-center h-[85vh] bg-[#040712]">
      <div className="relative w-20 h-20">
        <div className="absolute inset-0 rounded-full border border-cyan-500/10 animate-ping" />
        <div className="absolute inset-3 rounded-full border border-cyan-500/20 animate-spin" style={{ animationDuration: "3s" }} />
        <div className="absolute inset-6 rounded-full border border-cyan-500/30 animate-spin" style={{ animationDuration: "2s", animationDirection: "reverse" }} />
        <div className="absolute inset-[26px] rounded-full bg-cyan-500/10" />
      </div>
    </div>
  );

  return (
    <div className="bg-[#040712] min-h-screen relative overflow-hidden">
      {/* === AMBIENT LAYER === */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Mesh blobs */}
        <div className="absolute top-[10%] left-[20%] w-[500px] h-[500px] rounded-full opacity-[0.02]" style={{ background: "radial-gradient(circle, #22D3EE, transparent 70%)", filter: "blur(100px)" }} />
        <div className="absolute bottom-[20%] right-[15%] w-[600px] h-[600px] rounded-full opacity-[0.015]" style={{ background: "radial-gradient(circle, #A78BFA, transparent 70%)", filter: "blur(100px)" }} />
        <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-[0.012]" style={{ background: "radial-gradient(circle, #3B82F6, transparent 60%)", filter: "blur(120px)" }} />

        {/* Floating particles (CSS only) */}
        {[...Array(12)].map((_, i) => (
          <div key={i} className="absolute w-1 h-1 rounded-full bg-white/[0.04] animate-pulse"
            style={{
              left: `${10 + (i * 7.3) % 80}%`,
              top: `${5 + (i * 11.7) % 85}%`,
              animationDelay: `${i * 0.4}s`,
              animationDuration: `${3 + i % 3}s`,
            }} />
        ))}

        {/* Hex grid pattern */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.02]">
          <defs>
            <pattern id="hexgrid" width="56" height="48.5" patternUnits="userSpaceOnUse" patternTransform="scale(1.5)">
              <path d="M28 0 L56 14 L56 34.5 L28 48.5 L0 34.5 L0 14 Z" fill="none" stroke="white" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hexgrid)" />
        </svg>
      </div>

      {/* Search */}
      <div className="sticky top-16 z-40 bg-[#040712]/80 backdrop-blur-2xl border-b border-white/[0.03]">
        <div className="max-w-7xl mx-auto px-5 py-3 flex items-center gap-3">
          <div className="relative flex-1 max-w-xs">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input type="text" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)}
              className="w-full bg-white/[0.03] border border-white/[0.05] rounded-xl pl-9 pr-3 py-2 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-white/10 transition-all" />
          </div>
          <span className="text-[11px] text-gray-600 ml-auto">{total} companies</span>
        </div>
      </div>

      {/* === MAP === */}
      <div className="relative z-10 w-full" style={{ height: "calc(100vh - 130px)", minHeight: 700 }}>

        {/* SVG layer for inter-cluster connection lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-[0.04]">
          {/* Lines connecting nearby clusters */}
          {filtered.filter(c => c.logos.length > 0).map((cat, ci) => {
            const p1 = POS[cat.id];
            if (!p1) return null;
            return filtered.filter(c2 => c2.logos.length > 0 && c2.id > cat.id).map(cat2 => {
              const p2 = POS[cat2.id];
              if (!p2) return null;
              const dist = Math.sqrt((p1[0]-p2[0])**2 + (p1[1]-p2[1])**2);
              if (dist > 40) return null; // Only connect nearby clusters
              return <line key={`${cat.id}-${cat2.id}`}
                x1={`${p1[0]}%`} y1={`${p1[1]}%`} x2={`${p2[0]}%`} y2={`${p2[1]}%`}
                stroke="white" strokeWidth="0.5" strokeDasharray="4 8" />;
            });
          })}
        </svg>

        {filtered.filter(c => c.logos.length > 0).map(cat => {
          const meta = CATS[cat.id];
          const pos = POS[cat.id];
          if (!meta || !pos) return null;

          const isFocused = focused === cat.id;
          const isDimmed = focused !== null && !isFocused;
          const logos = cat.logos;
          // Exact logo counts scraped from treasurymap.com (site cat 1-15 = API cat 0-14)
          const SITE_COUNTS: Record<number, number> = {
            0:4, 1:2, 2:7, 3:4, 4:15, 5:18, 6:3, 7:1, 8:4, 9:5, 10:15, 11:7, 12:10, 13:15, 14:3,
          };
          const showCount = SITE_COUNTS[cat.id] ?? Math.min(logos.length, 10);
          const showLogos = logos.slice(0, showCount);
          const spread = Math.min(18, 6 + showCount * 0.22);
          const pts = organicSpiral(showCount, spread, cat.id * 2.3);
          const scale = isFocused ? 1.2 : isDimmed ? 0.65 : 1;

          return (
            <div key={cat.id} className="absolute transition-all duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{
                left: `${pos[0]}%`, top: `${pos[1]}%`,
                transform: `translate(-50%,-50%) scale(${scale})`,
                opacity: isDimmed ? 0.06 : 1,
                zIndex: isFocused ? 20 : 1,
              }}
              onMouseEnter={() => setFocused(cat.id)}
              onMouseLeave={() => setFocused(null)}
            >
              {/* Nebula glow */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none transition-all duration-[800ms]"
                style={{
                  width: spread * 12, height: spread * 12,
                  background: `radial-gradient(ellipse, rgba(${meta.glow}, ${isFocused ? 0.12 : 0.04}) 0%, rgba(${meta.glow}, 0.01) 50%, transparent 70%)`,
                  filter: "blur(4px)",
                }} />

              {/* Orbital ring — elliptical for organic feel */}
              <svg className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none overflow-visible transition-all duration-700"
                style={{ width: spread * 8, height: spread * 7 }}>
                <ellipse cx="50%" cy="50%" rx="48%" ry="44%"
                  fill="none" stroke={meta.color}
                  strokeOpacity={isFocused ? 0.12 : 0.04}
                  strokeWidth="0.5" strokeDasharray={isFocused ? "none" : "2 6"} />
                {/* Second ring */}
                {isFocused && <ellipse cx="50%" cy="50%" rx="38%" ry="34%"
                  fill="none" stroke={meta.color} strokeOpacity="0.06" strokeWidth="0.5" strokeDasharray="1 4" />}
              </svg>

              {/* Connection lines — organic curves */}
              <svg className="absolute left-1/2 top-1/2 pointer-events-none overflow-visible" style={{ width: 1, height: 1 }}>
                {pts.map(([dx, dy], i) => {
                  const mx = dx * 0.4, my = dy * 0.4;
                  return <path key={i} d={`M0,0 Q${mx + dy*0.15},${my - dx*0.15} ${dx},${dy}`}
                    fill="none" stroke={meta.color}
                    strokeOpacity={isFocused ? 0.1 : 0.03} strokeWidth="0.5" />;
                })}
              </svg>

              {/* Center node */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none">
                {/* Pulsing ring */}
                {isFocused && (
                  <div className="absolute -inset-3 rounded-full animate-ping opacity-20"
                    style={{ borderColor: meta.color, border: "1px solid" }} />
                )}
                <div className="rounded-full flex items-center justify-center transition-all duration-500"
                  style={{
                    width: isFocused ? 52 : 40,
                    height: isFocused ? 52 : 40,
                    background: `radial-gradient(circle, rgba(${meta.glow}, ${isFocused ? 0.2 : 0.1}) 0%, rgba(${meta.glow}, 0.02) 100%)`,
                    border: `1px solid rgba(${meta.glow}, ${isFocused ? 0.35 : 0.15})`,
                    boxShadow: isFocused ? `0 0 30px rgba(${meta.glow}, 0.15), inset 0 0 15px rgba(${meta.glow}, 0.05)` : "none",
                  }}>
                  <span className="text-[8px] font-black tracking-[0.15em] uppercase" style={{ color: meta.color }}>{meta.label}</span>
                </div>
              </div>

              {/* Logos */}
              {pts.map(([dx, dy], i) => {
                const logo = showLogos[i];
                if (!logo) return null;
                const cid = logo.url?.match(/companyPage\/(\d+)/)?.[1];
                const k = `${cat.id}-${i}`;
                const isH = hovered === k;
                const sz = isFocused ? 30 : 22;

                return (
                  <Link key={k} href={cid ? `/company/${cid}` : "#"}
                    className="absolute transition-all duration-500 ease-out"
                    style={{ left: dx - sz/2, top: dy - sz/2, zIndex: isH ? 30 : 2 }}
                    onMouseEnter={() => setHovered(k)}
                    onMouseLeave={() => setHovered(null)}
                  >
                    <div className="relative transition-all duration-200"
                      style={{ width: sz, height: sz, transform: isH ? "scale(1.8)" : "scale(1)" }}>
                      {isH && (
                        <div className="absolute -inset-3 rounded-full"
                          style={{ background: `radial-gradient(circle, rgba(${meta.glow}, 0.25), transparent 70%)` }} />
                      )}
                      <div className="w-full h-full rounded-full overflow-hidden transition-all duration-200"
                        style={{
                          background: isH ? "rgba(255,255,255,0.95)" : `rgba(${meta.glow}, 0.06)`,
                          backdropFilter: "blur(8px)",
                          border: `1px solid rgba(${meta.glow}, ${isH ? 0.5 : 0.12})`,
                          boxShadow: isH ? `0 0 16px rgba(${meta.glow}, 0.35)` : "none",
                        }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={logo.image || ""} alt="" loading="lazy"
                          className="w-full h-full object-contain p-[4px] rounded-full transition-all duration-200"
                          style={{ filter: isH ? "none" : "brightness(2) contrast(0.5) saturate(0)" }}
                          onError={e => { (e.target as HTMLImageElement).style.opacity = "0"; }} />
                      </div>
                    </div>
                    {isH && (
                      <div className="absolute -top-10 left-1/2 -translate-x-1/2 pointer-events-none z-50">
                        <div className="px-3 py-1.5 rounded-lg text-[9px] font-semibold text-white whitespace-nowrap backdrop-blur-md"
                          style={{ background: `rgba(${meta.glow}, 0.85)`, boxShadow: `0 4px 20px rgba(${meta.glow}, 0.25)` }}>
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
      <div className="relative z-10 max-w-5xl mx-auto px-6 py-6 flex flex-wrap justify-center gap-1.5">
        {Object.entries(CATS).map(([id, m]) => {
          const c = filtered.find(c => c.id === parseInt(id));
          if (!c || c.logos.length === 0) return null;
          const isA = focused === parseInt(id);
          return (
            <button key={id}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-medium transition-all duration-300"
              style={{
                color: isA ? m.color : "rgb(100,116,139)",
                background: isA ? `rgba(${m.glow}, 0.08)` : "transparent",
                border: `1px solid ${isA ? `rgba(${m.glow}, 0.2)` : "transparent"}`,
              }}
              onMouseEnter={() => setFocused(parseInt(id))}
              onMouseLeave={() => setFocused(null)}
            >
              <div className="w-1.5 h-1.5 rounded-full transition-all" style={{ backgroundColor: m.color, boxShadow: isA ? `0 0 6px ${m.color}` : "none" }} />
              {m.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

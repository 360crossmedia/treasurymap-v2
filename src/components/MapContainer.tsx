// MAP CORE — do not refactor without explicit instruction
"use client";

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
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

const SITE_COUNTS: Record<number, number> = {
  0:4, 1:2, 2:7, 3:4, 4:15, 5:18, 6:3, 7:1, 8:4, 9:5, 10:15, 11:7, 12:10, 13:15, 14:3,
};

// Positions — safe zone 15-85%, center (50,50) kept clear for title
const POS: Record<number, [number, number]> = {
  5:  [50, 18],  // TMS — top center
  3:  [20, 15],  // Integrators — top left
  0:  [80, 15],  // FIDP — top right
  1:  [35, 30],  // FDF
  13: [65, 30],  // Insurance
  4:  [18, 42],  // OTS — left
  11: [82, 42],  // RegTech — right
  2:  [20, 62],  // CMA — left-bottom
  6:  [80, 62],  // BI — right-bottom
  12: [38, 72],  // Banking
  7:  [62, 72],  // ERP
  9:  [50, 84],  // FSC — bottom center
  10: [20, 84],  // CFF
  8:  [80, 84],  // ETL
  14: [50, 6],   // Other — very top
};

interface Props { initialData?: MapCategory[] }

export function MapContainer({ initialData }: Props) {
  const [data, setData] = useState<MapCategory[]>(initialData || []);
  const [loading, setLoading] = useState(!initialData);
  const [search, setSearch] = useState("");
  const [focused, setFocused] = useState<number | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const leaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  const total = filtered.reduce((a, c) => a + Math.min(c.logos.length, SITE_COUNTS[c.id] || 10), 0);

  // Debounced cluster focus — prevents flickering when moving between logos/clusters
  const enterCluster = useCallback((id: number) => {
    if (leaveTimer.current) { clearTimeout(leaveTimer.current); leaveTimer.current = null; }
    setFocused(id);
  }, []);

  const leaveCluster = useCallback(() => {
    leaveTimer.current = setTimeout(() => setFocused(null), 300);
  }, []);

  // Force-separated organic layout
  function organicLayout(n: number, minGap: number, seed: number): [number, number][] {
    if (n === 0) return [];
    if (n === 1) return [[minGap * 1.2, 0]];
    const pts: [number, number][] = [];
    const ga = 137.508 * Math.PI / 180;
    for (let i = 0; i < n; i++) {
      const r = minGap * 0.85 * Math.sqrt(i + 1);
      const theta = i * ga + seed * 0.7;
      const jx = Math.sin(i * 7.3 + seed) * 5;
      const jy = Math.cos(i * 5.7 + seed) * 5;
      pts.push([r * Math.cos(theta) + jx, r * Math.sin(theta) + jy]);
    }
    // Push apart overlapping
    for (let iter = 0; iter < 4; iter++) {
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[j][0] - pts[i][0], dy = pts[j][1] - pts[i][1];
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < minGap && dist > 0) {
            const push = (minGap - dist) / 2 + 1;
            const nx = dx / dist, ny = dy / dist;
            pts[i][0] -= nx * push; pts[i][1] -= ny * push;
            pts[j][0] += nx * push; pts[j][1] += ny * push;
          }
        }
        // Push away from center
        const cd = Math.sqrt(pts[i][0] ** 2 + pts[i][1] ** 2);
        if (cd < minGap * 0.9 && cd > 0) {
          const push = minGap * 0.9 - cd + 2;
          pts[i][0] += (pts[i][0] / cd) * push;
          pts[i][1] += (pts[i][1] / cd) * push;
        }
      }
    }
    return pts;
  }

  if (loading) return (
    <div className="flex items-center justify-center h-[85vh] bg-[#040712]">
      <div className="relative w-20 h-20">
        <div className="absolute inset-0 rounded-full border border-cyan-500/10 animate-ping" />
        <div className="absolute inset-3 rounded-full border border-cyan-500/20 animate-spin" style={{ animationDuration: "3s" }} />
        <div className="absolute inset-6 rounded-full border border-cyan-500/30 animate-spin" style={{ animationDuration: "2s", animationDirection: "reverse" }} />
      </div>
    </div>
  );

  return (
    <div className="bg-[#040712] min-h-screen relative overflow-hidden">
      {/* === AMBIENT === */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Mesh blobs */}
        <div className="absolute top-[10%] left-[20%] w-[600px] h-[600px] rounded-full opacity-[0.018]" style={{ background: "radial-gradient(circle, #22D3EE, transparent 70%)", filter: "blur(100px)" }} />
        <div className="absolute bottom-[20%] right-[15%] w-[600px] h-[600px] rounded-full opacity-[0.015]" style={{ background: "radial-gradient(circle, #A78BFA, transparent 70%)", filter: "blur(100px)" }} />
        <div className="absolute top-[45%] left-[45%] w-[900px] h-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.012]" style={{ background: "radial-gradient(circle, #3B82F6, transparent 60%)", filter: "blur(120px)" }} />

        {/* Particles */}
        {[...Array(20)].map((_, i) => (
          <div key={i} className="absolute rounded-full bg-white animate-pulse"
            style={{
              width: 1 + (i % 3), height: 1 + (i % 3),
              opacity: 0.02 + (i % 4) * 0.01,
              left: `${(i * 13.7) % 95}%`, top: `${(i * 17.3) % 92}%`,
              animationDelay: `${i * 0.3}s`, animationDuration: `${3 + i % 4}s`,
            }} />
        ))}

        {/* Hex grid */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.015]">
          <defs><pattern id="hex" width="56" height="48.5" patternUnits="userSpaceOnUse" patternTransform="scale(2)">
            <path d="M28 0L56 14V34.5L28 48.5 0 34.5V14Z" fill="none" stroke="white" strokeWidth="0.3" />
          </pattern></defs>
          <rect width="100%" height="100%" fill="url(#hex)" />
        </svg>

        {/* Concentric rings from center */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.02]">
          {[150, 280, 420].map((r, i) => (
            <circle key={i} cx="50%" cy="48%" r={r} fill="none" stroke="cyan" strokeWidth="0.5"
              strokeDasharray={i === 0 ? "none" : `${3 + i * 2} ${8 + i * 3}`} />
          ))}
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
      <div className="relative z-10 w-full" style={{ height: "max(calc(100vh - 100px), 850px)" }}>

        {/* CENTER TITLE — "Treasury MAP" */}
        <div className="absolute left-1/2 top-[50%] -translate-x-1/2 -translate-y-1/2 z-[5] pointer-events-none text-center">
          <div className="relative">
            <div className="absolute -inset-32 blur-[100px] opacity-[0.12]" style={{ background: "radial-gradient(circle, #06B6D4, transparent 60%)" }} />
            <h2 className="text-[60px] sm:text-[90px] font-black tracking-[0.2em] uppercase leading-none" style={{ color: "rgba(255,255,255,0.07)" }}>
              Treasury
            </h2>
            <h2 className="text-[44px] sm:text-[66px] font-black tracking-[0.4em] uppercase -mt-1" style={{ color: "rgba(6,182,212,0.08)" }}>
              MAP
            </h2>
            <div className="mt-4 flex items-center justify-center gap-3">
              <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-cyan-500/20" />
              <span className="text-[10px] tracking-[0.5em] uppercase text-cyan-400/20 font-semibold">
                Technology Landscape
              </span>
              <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-cyan-500/20" />
            </div>
          </div>
        </div>

        {/* Inter-cluster connection lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-[0.03]">
          {filtered.filter(c => c.logos.length > 0).map(cat => {
            const p1 = POS[cat.id];
            if (!p1) return null;
            return filtered.filter(c2 => c2.logos.length > 0 && c2.id > cat.id).map(cat2 => {
              const p2 = POS[cat2.id];
              if (!p2) return null;
              const dist = Math.sqrt((p1[0]-p2[0])**2 + (p1[1]-p2[1])**2);
              if (dist > 35) return null;
              return <line key={`${cat.id}-${cat2.id}`}
                x1={`${p1[0]}%`} y1={`${p1[1]}%`} x2={`${p2[0]}%`} y2={`${p2[1]}%`}
                stroke="white" strokeWidth="0.5" strokeDasharray="4 12" />;
            });
          })}
        </svg>

        {/* Clusters */}
        {filtered.filter(c => c.logos.length > 0).map(cat => {
          const meta = CATS[cat.id];
          const pos = POS[cat.id];
          if (!meta || !pos) return null;

          const isFocused = focused === cat.id;
          const isDimmed = focused !== null && !isFocused;
          const showCount = Math.min(cat.logos.length, SITE_COUNTS[cat.id] ?? 10);
          const showLogos = cat.logos.slice(0, showCount);
          const sz = isFocused ? 54 : 44;
          const minGap = sz + 10;
          const pts = organicLayout(showCount, minGap, cat.id * 2.3);
          const scale = isFocused ? 1.15 : isDimmed ? 0.7 : 1;

          // Bounding box of cluster for hover zone
          const maxR = pts.reduce((m, [x, y]) => Math.max(m, Math.sqrt(x*x + y*y)), 0) + sz;

          return (
            <div key={cat.id} className="absolute transition-all duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{
                left: `${pos[0]}%`, top: `${pos[1]}%`,
                transform: `translate(-50%,-50%) scale(${scale})`,
                opacity: isDimmed ? 0.08 : 1,
                zIndex: isFocused ? 20 : 1,
              }}
            >
              {/* HOVER ZONE — invisible expanded hitbox for the whole cluster */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
                style={{ width: maxR * 2 + 60, height: maxR * 2 + 60 }}
                onMouseEnter={() => enterCluster(cat.id)}
                onMouseLeave={leaveCluster}
              />

              {/* Nebula */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none transition-all duration-[800ms]"
                style={{
                  width: maxR * 3, height: maxR * 3,
                  background: `radial-gradient(ellipse, rgba(${meta.glow}, ${isFocused ? 0.1 : 0.03}) 0%, transparent 70%)`,
                  filter: "blur(8px)",
                }} />

              {/* Orbital ring */}
              <svg className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none overflow-visible transition-all duration-700"
                style={{ width: maxR * 2.2, height: maxR * 2 }}>
                <ellipse cx="50%" cy="50%" rx="48%" ry="44%"
                  fill="none" stroke={meta.color}
                  strokeOpacity={isFocused ? 0.1 : 0.03}
                  strokeWidth="0.5" strokeDasharray={isFocused ? "2 4" : "1 8"} />
              </svg>

              {/* Connection curves */}
              <svg className="absolute left-1/2 top-1/2 pointer-events-none overflow-visible" style={{ width: 1, height: 1 }}>
                {pts.map(([dx, dy], i) => (
                  <path key={i} d={`M0,0 Q${dx*0.4+dy*0.1},${dy*0.4-dx*0.1} ${dx},${dy}`}
                    fill="none" stroke={meta.color}
                    strokeOpacity={isFocused ? 0.08 : 0.025} strokeWidth="0.5" />
                ))}
              </svg>

              {/* Center node */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none">
                {isFocused && <div className="absolute -inset-3 rounded-full animate-ping opacity-15" style={{ border: `1px solid ${meta.color}` }} />}
                <div className="rounded-full flex items-center justify-center transition-all duration-500"
                  style={{
                    width: isFocused ? 68 : 56, height: isFocused ? 68 : 56,
                    background: `radial-gradient(circle, rgba(${meta.glow}, ${isFocused ? 0.18 : 0.08}), rgba(${meta.glow}, 0.02))`,
                    border: `1px solid rgba(${meta.glow}, ${isFocused ? 0.3 : 0.12})`,
                    boxShadow: isFocused ? `0 0 40px rgba(${meta.glow}, 0.15), inset 0 0 20px rgba(${meta.glow}, 0.05)` : "none",
                  }}>
                  <span className="text-[11px] font-black tracking-[0.1em] uppercase" style={{ color: meta.color }}>{meta.label}</span>
                </div>
              </div>

              {/* Logos */}
              {pts.map(([dx, dy], i) => {
                const logo = showLogos[i];
                if (!logo) return null;
                const cid = logo.url?.match(/companyPage\/(\d+)/)?.[1];
                const k = `${cat.id}-${i}`;
                const isH = hovered === k;

                return (
                  <Link key={k} href={cid ? `/company/${cid}` : "#"}
                    className="absolute transition-all duration-500 ease-out"
                    style={{ left: dx - sz/2, top: dy - sz/2, zIndex: isH ? 30 : 2 }}
                    onMouseEnter={() => setHovered(k)}
                    onMouseLeave={() => setHovered(null)}
                  >
                    <div className="relative transition-all duration-200"
                      style={{ width: sz, height: sz, transform: isH ? "scale(1.5)" : "scale(1)" }}>
                      {isH && <div className="absolute -inset-3 rounded-full" style={{ background: `radial-gradient(circle, rgba(${meta.glow}, 0.25), transparent 70%)` }} />}
                      <div className="w-full h-full rounded-full overflow-hidden transition-all duration-200"
                        style={{
                          background: isH ? "rgba(255,255,255,0.95)" : `rgba(${meta.glow}, 0.06)`,
                          backdropFilter: "blur(8px)",
                          border: `1px solid rgba(${meta.glow}, ${isH ? 0.5 : 0.12})`,
                          boxShadow: isH ? `0 0 20px rgba(${meta.glow}, 0.35)` : "none",
                        }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={logo.image || ""} alt="" loading="lazy"
                          className="w-full h-full object-contain p-[5px] rounded-full transition-all duration-200"
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
              onMouseEnter={() => enterCluster(parseInt(id))}
              onMouseLeave={leaveCluster}
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

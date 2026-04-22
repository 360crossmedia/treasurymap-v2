// MAP CORE — constellation map
// Each logo individually placed on a shared canvas, grouped by spatial clustering + category halo
// Matches treasurymap.com's math approach (scattered logos, no rigid cluster grids)
"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import type { MapCategory } from "@/lib/api";

type Zone = "sources" | "core" | "analytics" | "execution" | "adjacent";
type CatMeta = {
  label: string;
  color: string;
  blurb: string;
  zone: Zone;
  pos: { x: number; y: number };  // cluster center in % of canvas
  labelOffset: { x: number; y: number }; // label position relative to center, %
  count: number; // vendors to show (matches treasurymap.com)
};

// Canvas mental model: 100×100 units. Desktop renders at min(1500px, 100vw) × min(1000px, 100vh - header)
// Positions hand-tuned to spread clusters across canvas without overlap
const CATS: Record<number, CatMeta> = {
  0:  { label: "FIDP",        color: "#60A5FA", zone: "sources",   pos: { x: 10, y: 22 }, labelOffset: { x: 0,  y: -10 }, count: 4,  blurb: "Financial instrument data providers — market & reference data." },
  1:  { label: "FDF",         color: "#A78BFA", zone: "sources",   pos: { x: 7,  y: 50 }, labelOffset: { x: 0,  y: -8 },  count: 2,  blurb: "Financial data feeds — real-time price & rate streams." },
  8:  { label: "ETL",         color: "#2DD4BF", zone: "sources",   pos: { x: 13, y: 76 }, labelOffset: { x: 0,  y: -10 }, count: 4,  blurb: "Data pipelines feeding the treasury stack." },

  7:  { label: "ERP",         color: "#F87171", zone: "core",      pos: { x: 30, y: 18 }, labelOffset: { x: 0,  y: -7 },  count: 1,  blurb: "Enterprise Resource Planning — financial source of truth." },
  5:  { label: "TMS",         color: "#22D3EE", zone: "core",      pos: { x: 48, y: 48 }, labelOffset: { x: 0,  y: -17 }, count: 18, blurb: "Treasury Management Systems — the operational core." },
  12: { label: "Banking",     color: "#4ADE80", zone: "core",      pos: { x: 32, y: 80 }, labelOffset: { x: 0,  y: -12 }, count: 10, blurb: "Bank connectivity & portals." },

  6:  { label: "BI",          color: "#E879F9", zone: "analytics", pos: { x: 68, y: 14 }, labelOffset: { x: 0,  y: -8 },  count: 3,  blurb: "Business Intelligence & treasury analytics." },
  10: { label: "CFF",         color: "#C084FC", zone: "analytics", pos: { x: 88, y: 40 }, labelOffset: { x: 0,  y: -14 }, count: 15, blurb: "Cash Flow Forecasting specialists." },

  4:  { label: "OTS",         color: "#FBBF24", zone: "execution", pos: { x: 68, y: 36 }, labelOffset: { x: 0,  y: -14 }, count: 15, blurb: "Order & Trade Systems for FX, MM, securities." },
  2:  { label: "CMA",         color: "#F472B6", zone: "execution", pos: { x: 80, y: 62 }, labelOffset: { x: 0,  y: -12 }, count: 7,  blurb: "Capital Markets Applications — trading & portfolio tooling." },
  9:  { label: "FSC",         color: "#FB923C", zone: "execution", pos: { x: 92, y: 78 }, labelOffset: { x: 0,  y: -10 }, count: 5,  blurb: "Financial Supply Chain — payables, receivables, financing." },

  11: { label: "RegTech",     color: "#38BDF8", zone: "adjacent",  pos: { x: 50, y: 8  }, labelOffset: { x: 0,  y: -6 },  count: 7,  blurb: "Regulatory, compliance & reporting technology." },
  13: { label: "Insurance",   color: "#FB7185", zone: "adjacent",  pos: { x: 62, y: 82 }, labelOffset: { x: 0,  y: -14 }, count: 15, blurb: "Insurance & hedging for treasury risk." },
  3:  { label: "Integrators", color: "#34D399", zone: "adjacent",  pos: { x: 26, y: 92 }, labelOffset: { x: 0,  y: -10 }, count: 4,  blurb: "System integrators connecting treasury stacks." },
  14: { label: "Other",       color: "#94A3B8", zone: "adjacent",  pos: { x: 8,  y: 92 }, labelOffset: { x: 0,  y: -10 }, count: 3,  blurb: "Adjacent & emerging treasury tools." },
};

const LINKS: Record<number, number[]> = {
  5:  [7, 12, 1, 10, 6, 3, 4],
  7:  [5, 8, 3, 12],
  12: [5, 7, 11, 9, 13],
  1:  [5, 10, 0, 2],
  10: [5, 1, 12, 9],
  6:  [5, 8, 7],
  8:  [6, 7, 3],
  11: [12, 13, 2],
  3:  [7, 8, 5],
  0:  [1, 2, 5],
  4:  [5, 9, 2],
  2:  [1, 0, 4, 11],
  9:  [12, 10, 4, 5],
  13: [12, 11],
  14: [],
};

const LINE_PAIRS: [number, number][] = (() => {
  const seen = new Set<string>();
  const pairs: [number, number][] = [];
  Object.entries(LINKS).forEach(([a, bs]) => {
    const aN = parseInt(a);
    bs.forEach(b => {
      const key = aN < b ? `${aN}-${b}` : `${b}-${aN}`;
      if (!seen.has(key)) { seen.add(key); pairs.push([aN, b]); }
    });
  });
  return pairs;
})();

// Compute individual logo positions via Fibonacci spiral per cluster
// Returns canvas-% coordinates so every logo is absolute-positioned on the shared canvas
function computeLogoPositions(catId: number, count: number): Array<{ x: number; y: number; scale: number }> {
  const center = CATS[catId].pos;
  const GA = 137.508 * Math.PI / 180;
  // Spread radius in % — tuned so clusters don't crash into each other
  const spread = count <= 1 ? 0 : Math.max(3.5, 2.2 + Math.sqrt(count) * 1.9);
  const out: Array<{ x: number; y: number; scale: number }> = [];
  for (let i = 0; i < count; i++) {
    if (count === 1) {
      out.push({ x: center.x, y: center.y, scale: 1 });
      continue;
    }
    // Normalized distance 0..1 (avoid zero at center)
    const rN = Math.sqrt((i + 0.9) / count);
    const r = spread * rN;
    const theta = i * GA + catId * 0.7; // slight per-cat rotation to avoid identical patterns
    // % is roughly isotropic on square canvas; compensate for aspect (canvas ~1500×900 ≈ 1.66 ratio)
    const dx = r * Math.cos(theta) * 0.78;
    const dy = r * Math.sin(theta) * 1.3;
    // Individual scale variation 0.88..1.12 — deterministic by index
    const scale = 0.88 + ((i * 31 + catId * 17) % 13) * 0.02;
    out.push({ x: center.x + dx, y: center.y + dy, scale });
  }
  return out;
}

interface Props { initialData?: MapCategory[] }

export function MapContainer({ initialData }: Props) {
  const [data, setData] = useState<MapCategory[]>(initialData || []);
  const [loading, setLoading] = useState(!initialData);
  const [search, setSearch] = useState("");
  const [focused, setFocused] = useState<number | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [panelCat, setPanelCat] = useState<number | null>(null);

  useEffect(() => {
    if (!initialData) {
      fetch("https://treasurymapbackend-production.up.railway.app/api/v1/mapdata")
        .then(r => r.json()).then(d => { setData(d); setLoading(false); })
        .catch(() => setLoading(false));
    }
  }, [initialData]);

  function catLogos(catId: number) {
    const cat = data.find(c => c.id === catId);
    if (!cat) return [];
    const live = cat.logos.filter(l => l.live);
    return live.slice(0, CATS[catId]?.count ?? live.length);
  }

  // Flatten: every logo with its absolute canvas position
  const allPlacements = useMemo(() => {
    const out: Array<{
      catId: number; logoIdx: number;
      logo: MapCategory["logos"][number];
      x: number; y: number; scale: number;
      color: string;
    }> = [];
    Object.keys(CATS).forEach(k => {
      const catId = parseInt(k);
      const logos = catLogos(catId);
      const positions = computeLogoPositions(catId, logos.length);
      logos.forEach((logo, i) => {
        out.push({
          catId,
          logoIdx: i,
          logo,
          x: positions[i].x,
          y: positions[i].y,
          scale: positions[i].scale,
          color: CATS[catId].color,
        });
      });
    });
    return out;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const matchKeys = useMemo(() => {
    if (!search.trim()) return null;
    const s = search.toLowerCase();
    const set = new Set<string>();
    allPlacements.forEach(p => {
      if (p.logo.keywords?.some(kw => kw.toLowerCase().includes(s))) {
        set.add(`${p.catId}-${p.logoIdx}`);
      }
    });
    return set;
  }, [allPlacements, search]);

  const totalCompanies = allPlacements.length;

  // Starfield — very dense
  const stars = useMemo(() => {
    const out: { x: number; y: number; s: number; o: number }[] = [];
    let seed = 17;
    const rand = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
    const r2 = (n: number) => Math.round(n * 100) / 100;
    for (let i = 0; i < 300; i++) {
      out.push({ x: r2(rand() * 100), y: r2(rand() * 100), s: r2(rand() * 1.6 + 0.3), o: r2(rand() * 0.6 + 0.12) });
    }
    return out;
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-[80vh] bg-[#050a18]">
      <div className="w-10 h-10 border-2 border-white/10 border-t-amber-400 rounded-full animate-spin" />
    </div>
  );

  const allCatIds = (Object.keys(CATS) as unknown as string[]).map(k => parseInt(k));

  return (
    <div className="bg-[#050a18] relative overflow-hidden min-h-screen">
      {/* Starfield */}
      <div className="absolute inset-0 pointer-events-none">
        {stars.map((s, i) => (
          <div key={i} className="absolute rounded-full bg-white"
            style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.s, height: s.s, opacity: s.o }} />
        ))}
      </div>

      {/* Header */}
      <div className="relative z-40 border-b border-white/[0.05] bg-[#050a18]/80 backdrop-blur">
        <div className="max-w-[1500px] mx-auto px-6 py-4 flex items-center gap-6 flex-wrap">
          <div className="shrink-0">
            <div className="text-[9px] tracking-[0.35em] text-amber-200/60 font-medium">THE TREASURY ECOSYSTEM</div>
            <div className="text-xl font-bold text-white tracking-tight">Treasury<span className="text-amber-300"> </span>Map</div>
          </div>
          <div className="relative flex-1 max-w-md min-w-[240px]">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input type="text" placeholder="Search vendors, keywords…" value={search} onChange={e => setSearch(e.target.value)}
              className="w-full bg-white/[0.05] border border-white/[0.08] rounded-lg pl-9 pr-3 py-2 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-amber-400/40 focus:bg-white/[0.08] transition" />
          </div>
          <span className="text-[11px] text-gray-500 ml-auto tabular-nums whitespace-nowrap">
            {totalCompanies} vendors · 15 categories
          </span>
        </div>
      </div>

      {/* Constellation canvas — desktop */}
      <div className="hidden md:block relative z-10">
        <div
          className="relative mx-auto"
          style={{
            width: "min(100vw, 1500px)",
            height: "min(calc(100vh - 90px), 1000px)",
            minHeight: 880,
          }}
        >
          {/* Cluster halos — each cat gets a big soft nebula */}
          {allCatIds.map(catId => {
            const meta = CATS[catId];
            const count = catLogos(catId).length;
            if (count === 0) return null;
            const isFocused = focused === catId;
            const isLinked = focused !== null && !isFocused && (LINKS[focused] || []).includes(catId);
            const isDim = focused !== null && !isFocused && !isLinked;
            const size = Math.max(260, 180 + Math.sqrt(count) * 80);
            return (
              <div
                key={`halo-${catId}`}
                className="absolute pointer-events-none rounded-full transition-all duration-500"
                style={{
                  left: `${meta.pos.x}%`,
                  top: `${meta.pos.y}%`,
                  width: size,
                  height: size,
                  transform: "translate(-50%,-50%)",
                  background: `radial-gradient(circle, ${meta.color}${isFocused ? "30" : "18"} 0%, ${meta.color}08 40%, transparent 72%)`,
                  opacity: isDim ? 0.25 : 1,
                  filter: "blur(6px)",
                }}
              />
            );
          })}

          {/* Central ambient sun */}
          <div
            className="absolute pointer-events-none"
            style={{
              left: "50%", top: "50%",
              transform: "translate(-50%,-50%)",
              width: 600, height: 600,
              background: "radial-gradient(circle, rgba(251,191,36,0.08) 0%, rgba(251,191,36,0.02) 40%, transparent 70%)",
            }}
          />

          {/* Permanent connection lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
            {LINE_PAIRS.map(([a, b]) => {
              const A = CATS[a].pos, B = CATS[b].pos;
              const isActive = focused === a || focused === b;
              const stroke = isActive ? CATS[focused!].color : "#ffffff";
              const opacity = isActive ? 0.55 : 0.06;
              return (
                <line key={`${a}-${b}`}
                  x1={A.x} y1={A.y} x2={B.x} y2={B.y}
                  stroke={stroke} strokeOpacity={opacity}
                  strokeWidth={isActive ? 0.18 : 0.1}
                  strokeDasharray={isActive ? "0.8 0.4" : "0.3 0.6"}
                  style={{ transition: "stroke-opacity 300ms, stroke-width 300ms" }}
                />
              );
            })}
          </svg>

          {/* Category labels — floating above each cluster center */}
          {allCatIds.map(catId => {
            const meta = CATS[catId];
            const count = catLogos(catId).length;
            if (count === 0) return null;
            const isFocused = focused === catId;
            const isLinked = focused !== null && !isFocused && (LINKS[focused] || []).includes(catId);
            const isDim = focused !== null && !isFocused && !isLinked;
            const labelX = meta.pos.x + meta.labelOffset.x;
            const labelY = meta.pos.y + meta.labelOffset.y;
            return (
              <div
                key={`label-${catId}`}
                className="absolute text-center transition-all duration-300"
                style={{
                  left: `${labelX}%`,
                  top: `${labelY}%`,
                  transform: "translate(-50%, -50%)",
                  pointerEvents: "auto",
                  zIndex: isFocused ? 25 : 6,
                  opacity: isDim ? 0.35 : 1,
                  cursor: "pointer",
                }}
                onMouseEnter={() => setFocused(catId)}
                onMouseLeave={() => setFocused(null)}
                onClick={() => setPanelCat(catId)}
              >
                <div
                  className="text-[12px] font-bold tracking-[0.2em] uppercase transition-all"
                  style={{
                    color: meta.color,
                    textShadow: "0 0 16px rgba(0,0,0,1), 0 0 6px rgba(0,0,0,0.9), 0 1px 0 rgba(0,0,0,0.6)",
                    letterSpacing: isFocused ? "0.25em" : "0.2em",
                  }}
                >
                  {meta.label}
                </div>
                <div
                  className="text-[9px] text-gray-300 tabular-nums mt-0.5 font-medium"
                  style={{ textShadow: "0 0 10px rgba(0,0,0,1), 0 0 4px rgba(0,0,0,0.9)" }}
                >
                  {count} {count > 1 ? "vendors" : "vendor"}
                </div>
              </div>
            );
          })}

          {/* All 113 logos placed individually */}
          {allPlacements.map(p => {
            const k = `${p.catId}-${p.logoIdx}`;
            const isH = hovered === k;
            const isMatch = matchKeys ? matchKeys.has(k) : true;
            const isFocusedCat = focused === p.catId;
            const isLinkedCat = focused !== null && focused !== p.catId && (LINKS[focused] || []).includes(p.catId);
            const isDimCat = focused !== null && !isFocusedCat && !isLinkedCat;
            const cid = p.logo.url?.match(/companyPage\/(\d+)/)?.[1];
            const baseSize = 56;
            const size = baseSize * p.scale;

            return (
              <Link
                key={k}
                href={cid ? `/company/${cid}` : "#"}
                className="absolute transition-all duration-200"
                style={{
                  left: `${p.x}%`,
                  top: `${p.y}%`,
                  width: size,
                  height: size,
                  transform: `translate(-50%,-50%) ${isH ? "translateY(-4px) scale(1.18)" : ""}`,
                  transformOrigin: "center",
                  borderRadius: 14,
                  background: "rgba(255,255,255,0.04)",
                  border: `1px solid ${isH ? p.color : "rgba(255,255,255,0.09)"}`,
                  boxShadow: isH
                    ? `0 14px 32px rgba(0,0,0,0.75), 0 0 0 1px ${p.color}, 0 0 28px ${p.color}88`
                    : `0 4px 14px rgba(0,0,0,0.5), 0 0 16px ${p.color}18`,
                  opacity: matchKeys && !isMatch ? 0.12 : (isDimCat ? 0.32 : 1),
                  zIndex: isH ? 60 : (isFocusedCat ? 20 : (isLinkedCat ? 12 : 8)),
                }}
                onMouseEnter={() => { setHovered(k); setFocused(p.catId); }}
                onMouseLeave={() => { setHovered(null); setFocused(null); }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.logo.image || ""}
                  alt=""
                  loading="lazy"
                  className="w-full h-full object-contain"
                  style={{
                    padding: size * 0.15,
                    filter: "drop-shadow(0 1px 3px rgba(0,0,0,0.6))",
                  }}
                  onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
                />
                {isH && (
                  <div className="absolute left-1/2 -top-9 -translate-x-1/2 pointer-events-none z-50">
                    <div className="px-2 py-1 rounded text-[10px] font-medium text-white whitespace-nowrap shadow-lg"
                      style={{ backgroundColor: p.color }}>
                      {(p.logo.keywords?.[0] || "View").substring(0, 32)}
                    </div>
                  </div>
                )}
              </Link>
            );
          })}

          {/* Focus tooltip */}
          {focused !== null && hovered === null && (() => {
            const meta = CATS[focused];
            const links = LINKS[focused] || [];
            const pos = meta.pos;
            const isBelow = pos.y < 50;
            return (
              <div
                className="absolute pointer-events-none z-40 transition-all duration-200"
                style={{
                  left: `${pos.x}%`,
                  top: `${pos.y}%`,
                  transform: `translate(-50%, ${isBelow ? "180px" : "-200px"})`,
                }}
              >
                <div className="bg-[#0a1426]/95 backdrop-blur border border-white/10 rounded-lg px-3 py-2.5 w-60 shadow-2xl">
                  <div className="text-[10px] font-bold uppercase tracking-[0.15em]" style={{ color: meta.color }}>
                    {meta.label}
                  </div>
                  <div className="text-[11px] text-gray-300 mt-1.5 leading-snug">{meta.blurb}</div>
                  {links.length > 0 && (
                    <div className="mt-2.5 pt-2 border-t border-white/10">
                      <div className="text-[8px] uppercase tracking-[0.15em] text-gray-500 mb-1.5">Connects to</div>
                      <div className="flex flex-wrap gap-1">
                        {links.map(id => (
                          <span key={id} className="text-[9px] px-1.5 py-0.5 rounded"
                            style={{ color: CATS[id].color, backgroundColor: `${CATS[id].color}1a` }}>
                            {CATS[id].label}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })()}
        </div>
      </div>

      {/* Side panel — full list */}
      {panelCat !== null && (() => {
        const pMeta = CATS[panelCat];
        const logos = catLogos(panelCat);
        return (
          <div className="fixed inset-0 z-50">
            <button
              onClick={() => setPanelCat(null)}
              aria-label="Close panel"
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <div className="absolute right-0 top-0 h-full w-full max-w-md bg-[#0a1426] border-l border-white/10 shadow-2xl flex flex-col">
              <header className="px-6 py-5 border-b border-white/10 flex items-start justify-between gap-4">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-[0.18em]" style={{ color: pMeta.color }}>
                    {pMeta.label}
                  </div>
                  <div className="text-sm text-gray-300 mt-1.5 leading-snug">{pMeta.blurb}</div>
                  <div className="text-[11px] text-gray-500 mt-2 tabular-nums">{logos.length} vendors</div>
                </div>
                <button
                  onClick={() => setPanelCat(null)}
                  className="text-gray-500 hover:text-white transition p-1 -m-1"
                  aria-label="Close"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </header>
              <div className="flex-1 overflow-y-auto px-6 py-5">
                <div className="grid grid-cols-3 gap-3">
                  {logos.map((logo, i) => {
                    const cid = logo.url?.match(/companyPage\/(\d+)/)?.[1];
                    return (
                      <Link key={i} href={cid ? `/company/${cid}` : "#"}
                        className="group flex flex-col items-center gap-2 p-2 rounded-lg hover:bg-white/5 transition"
                        onClick={() => setPanelCat(null)}>
                        <div className="w-full aspect-square rounded-md overflow-hidden flex items-center justify-center"
                          style={{
                            background: "rgba(255,255,255,0.035)",
                            border: `1px solid ${pMeta.color}33`,
                          }}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={logo.image || ""} alt=""
                            className="w-full h-full object-contain p-1.5"
                            onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                        </div>
                        <div className="text-[10px] text-gray-400 group-hover:text-white text-center line-clamp-2 leading-tight">
                          {logo.keywords?.[0] || "View vendor"}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Mobile — zones stacked */}
      <div className="md:hidden relative z-10 px-4 pb-10 pt-4">
        {(["sources", "core", "execution", "analytics", "adjacent"] as const).map(zone => {
          const zoneCats = allCatIds.filter(id => CATS[id].zone === zone);
          const zoneLabel = { sources: "Data Sources", core: "Treasury Core", analytics: "Analytics", execution: "Execution", adjacent: "Adjacent Ecosystem" }[zone];
          return (
            <div key={zone} className="mb-8">
              <div className="text-[10px] tracking-[0.25em] uppercase text-gray-500 mb-3">{zoneLabel}</div>
              <div className="space-y-4">
                {zoneCats.map(catId => {
                  const meta = CATS[catId];
                  const logos = catLogos(catId);
                  if (logos.length === 0) return null;
                  const visible = logos.slice(0, 8);
                  return (
                    <section key={catId} className="rounded-xl p-3"
                      style={{
                        background: `linear-gradient(135deg, ${meta.color}12 0%, ${meta.color}05 100%)`,
                        border: `1px solid ${meta.color}33`,
                      }}>
                      <div className="flex items-baseline justify-between mb-3 gap-3">
                        <div className="min-w-0">
                          <div className="text-xs font-bold tracking-[0.15em] uppercase" style={{ color: meta.color }}>
                            {meta.label}
                          </div>
                          <div className="text-[11px] text-gray-400 mt-0.5 leading-snug">{meta.blurb}</div>
                        </div>
                        <div className="text-[10px] text-gray-500 tabular-nums shrink-0">{logos.length}</div>
                      </div>
                      <div className="grid grid-cols-4 gap-2">
                        {visible.map((logo, i) => {
                          const cid = logo.url?.match(/companyPage\/(\d+)/)?.[1];
                          const isMatch = matchKeys ? matchKeys.has(`${catId}-${i}`) : true;
                          return (
                            <Link key={i} href={cid ? `/company/${cid}` : "#"}
                              className="aspect-square rounded-lg overflow-hidden flex items-center justify-center transition"
                              style={{
                                background: "rgba(255,255,255,0.035)",
                                border: `1px solid ${(matchKeys && isMatch) ? meta.color : "rgba(255,255,255,0.08)"}`,
                                opacity: (matchKeys && !isMatch) ? 0.3 : 1,
                              }}>
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={logo.image || ""} alt="" loading="lazy"
                                className="w-full h-full object-contain p-1.5"
                                onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                            </Link>
                          );
                        })}
                        {logos.length > 8 && (
                          <button onClick={() => setPanelCat(catId)}
                            className="aspect-square rounded-lg text-xs font-semibold flex items-center justify-center"
                            style={{
                              color: meta.color,
                              background: `${meta.color}18`,
                              border: `1px dashed ${meta.color}66`,
                            }}>
                            +{logos.length - 8}
                          </button>
                        )}
                      </div>
                    </section>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

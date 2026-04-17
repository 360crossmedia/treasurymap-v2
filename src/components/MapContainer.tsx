// MAP CORE — solar system architecture
"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import type { MapCategory } from "@/lib/api";

type CatMeta = { label: string; color: string; blurb: string };

const CATS: Record<number, CatMeta> = {
  0:  { label: "FIDP",        color: "#60A5FA", blurb: "Financial instrument data providers — market & reference data." },
  1:  { label: "FDF",         color: "#A78BFA", blurb: "Financial data feeds — real-time price & rate streams." },
  2:  { label: "CMA",         color: "#F472B6", blurb: "Capital Markets Applications — trading & portfolio tooling." },
  3:  { label: "Integrators", color: "#34D399", blurb: "System integrators connecting treasury stacks." },
  4:  { label: "OTS",         color: "#FBBF24", blurb: "Order & Trade Systems for FX, MM, securities." },
  5:  { label: "TMS",         color: "#22D3EE", blurb: "Treasury Management Systems — the operational core." },
  6:  { label: "BI",          color: "#E879F9", blurb: "Business Intelligence & treasury analytics." },
  7:  { label: "ERP",         color: "#F87171", blurb: "Enterprise Resource Planning — the financial source of truth." },
  8:  { label: "ETL",         color: "#2DD4BF", blurb: "Data pipelines feeding the treasury stack." },
  9:  { label: "FSC",         color: "#FB923C", blurb: "Financial Supply Chain — payables, receivables, financing." },
  10: { label: "CFF",         color: "#C084FC", blurb: "Cash Flow Forecasting specialists." },
  11: { label: "RegTech",     color: "#38BDF8", blurb: "Regulatory, compliance & reporting technology." },
  12: { label: "Banking",     color: "#4ADE80", blurb: "Bank connectivity & portals." },
  13: { label: "Insurance",   color: "#FB7185", blurb: "Insurance & hedging for treasury risk." },
  14: { label: "Other",       color: "#94A3B8", blurb: "Adjacent & emerging treasury tools." },
};

// 3 orbital rings — radius in % of the square canvas side, from center (50,50)
const ORBITS: { r: number; cats: number[] }[] = [
  { r: 24, cats: [5, 7, 12, 1, 10] },   // inner: TMS, ERP, Banking, FDF, CFF
  { r: 33, cats: [6, 8, 11, 3, 0] },    // middle: BI, ETL, RegTech, Integrators, FIDP
  { r: 41, cats: [4, 2, 9, 13, 14] },   // outer: OTS, CMA, FSC, Insurance, Other
];

function r2(n: number) { return Math.round(n * 100) / 100; }

// Category-to-category business connections (undirected; only listed one-way)
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

function catPosition(catId: number): { x: number; y: number } | null {
  for (let i = 0; i < ORBITS.length; i++) {
    const o = ORBITS[i];
    const idx = o.cats.indexOf(catId);
    if (idx === -1) continue;
    const offset = i * 0.45;
    const angle = (idx / o.cats.length) * 2 * Math.PI + offset - Math.PI / 2;
    return { x: r2(50 + o.r * Math.cos(angle)), y: r2(50 + o.r * Math.sin(angle)) };
  }
  return null;
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

  const matchKeys = useMemo(() => {
    if (!search.trim()) return null;
    const s = search.toLowerCase();
    const set = new Set<string>();
    data.forEach(cat => {
      cat.logos.forEach((l, i) => {
        if (!l.live) return;
        if (l.keywords?.some(k => k.toLowerCase().includes(s))) set.add(`${cat.id}-${i}`);
      });
    });
    return set;
  }, [data, search]);

  const totalCompanies = useMemo(() =>
    data.reduce((a, c) => a + c.logos.filter(l => l.live).length, 0), [data]);

  function spiral(n: number, spread: number): [number, number][] {
    const pts: [number, number][] = [];
    const ga = 137.508 * Math.PI / 180;
    for (let i = 0; i < n; i++) {
      const r = spread * Math.sqrt(i + 0.5);
      const t = i * ga;
      pts.push([r2(r * Math.cos(t)), r2(r * Math.sin(t))]);
    }
    return pts;
  }

  // Deterministic starfield (rounded to avoid SSR/client FP drift)
  const stars = useMemo(() => {
    const out: { x: number; y: number; s: number; o: number }[] = [];
    let seed = 17;
    const rand = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
    for (let i = 0; i < 160; i++) {
      out.push({ x: r2(rand() * 100), y: r2(rand() * 100), s: r2(rand() * 1.4 + 0.3), o: r2(rand() * 0.55 + 0.12) });
    }
    return out;
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-[80vh] bg-[#050a18]">
      <div className="w-10 h-10 border-2 border-white/10 border-t-amber-400 rounded-full animate-spin" />
    </div>
  );

  const focusedPos = focused !== null ? catPosition(focused) : null;
  const focusedMeta = focused !== null ? CATS[focused] : null;
  const focusedLinks = focused !== null ? (LINKS[focused] || []).map(id => ({ id, pos: catPosition(id) })).filter(l => l.pos) : [];

  return (
    <div className="bg-[#050a18] relative overflow-hidden">
      {/* Starfield */}
      <div className="absolute inset-0 pointer-events-none">
        {stars.map((s, i) => (
          <div key={i} className="absolute rounded-full bg-white"
            style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.s, height: s.s, opacity: s.o }} />
        ))}
      </div>

      {/* Search bar */}
      <div className="sticky top-16 z-40 bg-[#050a18]/90 backdrop-blur-xl border-b border-white/[0.05]">
        <div className="max-w-7xl mx-auto px-5 py-3 flex items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input type="text" placeholder="Search vendors, keywords…" value={search} onChange={e => setSearch(e.target.value)}
              className="w-full bg-white/[0.05] border border-white/[0.08] rounded-lg pl-9 pr-3 py-2 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-amber-400/40 focus:bg-white/[0.08] transition" />
          </div>
          <span className="text-[11px] text-gray-500 ml-auto tabular-nums">
            {totalCompanies} companies · 15 categories
          </span>
        </div>
      </div>

      {/* Solar system — desktop only */}
      <div className="hidden md:block relative w-full" style={{ height: "calc(100vh - 9rem)", minHeight: 720 }}>
        {/* Ambient center glow */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: "radial-gradient(ellipse at 50% 50%, rgba(251,191,36,0.06) 0%, rgba(14,26,52,0.3) 35%, transparent 70%)",
        }} />

        {/* Centered square canvas */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 aspect-square"
          style={{ width: "min(94vw, calc(100vh - 11rem), 980px)" }}>

          {/* Orbit rings + connection lines (SVG) */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100">
            {ORBITS.map((o, i) => (
              <circle key={i} cx="50" cy="50" r={o.r}
                fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="0.1" />
            ))}
            {focusedPos && focusedLinks.map(({ id, pos }) => pos && (
              <line key={id}
                x1={focusedPos.x} y1={focusedPos.y} x2={pos.x} y2={pos.y}
                stroke={CATS[focused!].color} strokeOpacity="0.45"
                strokeWidth="0.15" strokeDasharray="0.6 0.4" />
            ))}
          </svg>

          {/* Sun = brand center */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none">
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{
                width: 340, height: 340,
                background: "radial-gradient(circle, rgba(251,191,36,0.32) 0%, rgba(251,191,36,0.12) 22%, rgba(251,191,36,0.03) 50%, transparent 72%)",
              }} />
            <div className="relative text-center">
              <div className="text-[9px] tracking-[0.35em] text-amber-200/60 font-medium mb-1.5">THE TREASURY ECOSYSTEM</div>
              <div className="text-2xl md:text-3xl font-bold text-white tracking-tight leading-none">
                Treasury<span className="text-amber-300"> </span>Map
              </div>
              <div className="text-[10px] tracking-wider text-gray-500 mt-2 tabular-nums">
                {totalCompanies} vendors · 15 categories
              </div>
            </div>
          </div>

          {/* Planets */}
          {(Object.keys(CATS) as unknown as string[]).map(k => parseInt(k)).map(catId => {
            const meta = CATS[catId];
            const pos = catPosition(catId);
            const cat = data.find(c => c.id === catId);
            if (!pos || !cat) return null;

            const liveLogos = cat.logos.filter(l => l.live);
            const count = liveLogos.length;
            if (count === 0) return null;

            const isFocused = focused === catId;
            const isLinked = focused !== null && !isFocused && (LINKS[focused] || []).includes(catId);
            const isDim = focused !== null && !isFocused && !isLinked;

            const clusterR = r2(Math.max(13, Math.min(26, 9 + Math.log2(count + 1) * 2.6)));
            const maxVisible = isFocused ? Math.min(count, 40) : Math.min(count, 12);
            const pts = spiral(maxVisible, clusterR * 0.55);
            const scale = isFocused ? 1.45 : isDim ? 0.8 : 1;
            // Label goes below the cluster when cluster sits in the top quarter
            // of the canvas (otherwise it gets eaten by the sticky search bar)
            const labelBelow = pos.y < 22;

            return (
              <div key={catId}
                className="absolute transition-all duration-500 ease-out"
                style={{
                  left: `${pos.x}%`, top: `${pos.y}%`,
                  transform: `translate(-50%,-50%) scale(${scale})`,
                  opacity: isDim ? 0.28 : 1,
                  zIndex: isFocused ? 30 : isLinked ? 15 : 5,
                }}
                onMouseEnter={() => setFocused(catId)}
                onMouseLeave={() => setFocused(null)}
              >
                {/* Planet ambient */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none transition-all duration-500"
                  style={{
                    width: isFocused ? 280 : 170, height: isFocused ? 280 : 170,
                    background: `radial-gradient(circle, ${meta.color}${isFocused ? "24" : "10"} 0%, transparent 65%)`,
                  }} />

                {/* Category label */}
                <div className="absolute left-1/2 -translate-x-1/2 text-center pointer-events-none z-10"
                  style={{ top: labelBelow ? (clusterR * 2 + 10) : -(clusterR * 2 + 22) }}>
                  <div className="text-[11px] font-bold tracking-[0.18em] uppercase"
                    style={{ color: meta.color, textShadow: "0 0 10px rgba(0,0,0,0.95), 0 0 4px rgba(0,0,0,0.9)" }}>
                    {meta.label}
                  </div>
                  <div className="text-[9px] text-gray-400 mt-0.5 tabular-nums" style={{ textShadow: "0 0 6px rgba(0,0,0,0.9)" }}>
                    {count} {count > 1 ? "companies" : "company"}
                  </div>
                </div>

                {/* Logos */}
                {pts.map(([dx, dy], i) => {
                  const logo = liveLogos[i];
                  if (!logo) return null;
                  const cid = logo.url?.match(/companyPage\/(\d+)/)?.[1];
                  const k = `${catId}-${i}`;
                  const isH = hovered === k;
                  const isMatch = matchKeys ? matchKeys.has(k) : true;
                  const sz = isFocused ? 38 : 28;

                  return (
                    <Link key={k} href={cid ? `/company/${cid}` : "#"}
                      className="absolute transition-all duration-300"
                      style={{
                        left: `calc(50% + ${dx}px)`, top: `calc(50% + ${dy}px)`,
                        transform: `translate(-50%,-50%) scale(${isH ? 1.3 : 1})`,
                        zIndex: isH ? 40 : 3,
                        opacity: matchKeys && !isMatch ? 0.2 : 1,
                      }}
                      onMouseEnter={() => setHovered(k)}
                      onMouseLeave={() => setHovered(null)}
                    >
                      <div className="rounded-lg overflow-hidden bg-white"
                        style={{
                          width: sz, height: sz,
                          boxShadow: isH
                            ? `0 0 0 2px ${meta.color}, 0 10px 28px rgba(0,0,0,0.85)`
                            : (matchKeys && isMatch)
                              ? `0 0 0 1.5px ${meta.color}, 0 2px 10px rgba(0,0,0,0.6)`
                              : "0 2px 8px rgba(0,0,0,0.5)",
                        }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={logo.image || ""} alt="" loading="lazy"
                          className="w-full h-full object-contain p-1"
                          onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                      </div>
                      {isH && (
                        <div className="absolute left-1/2 -top-9 -translate-x-1/2 pointer-events-none z-50">
                          <div className="px-2 py-1 rounded text-[10px] font-medium text-white whitespace-nowrap shadow-lg"
                            style={{ backgroundColor: meta.color }}>
                            {(logo.keywords?.[0] || "View").substring(0, 30)}
                          </div>
                        </div>
                      )}
                    </Link>
                  );
                })}

                {/* Overflow indicator — click to open full list */}
                {count > (isFocused ? 40 : 12) && (
                  <button
                    onClick={(e) => { e.stopPropagation(); setPanelCat(catId); }}
                    className="absolute left-1/2 top-1/2 text-[11px] font-bold cursor-pointer hover:scale-125 transition-transform z-20"
                    style={{
                      color: meta.color,
                      transform: `translate(${clusterR * 0.85}px, ${clusterR * 0.85}px)`,
                      textShadow: "0 0 10px rgba(0,0,0,1), 0 0 4px rgba(0,0,0,1)",
                    }}>
                    +{count - (isFocused ? 40 : 12)}
                  </button>
                )}
              </div>
            );
          })}

          {/* Focused tooltip — rendered at top level, unscaled */}
          {focusedPos && focusedMeta && focused !== null && (() => {
            const isBelow = focusedPos.y < 50;
            return (
              <div className="absolute pointer-events-none z-40 transition-all duration-300"
                style={{
                  left: `${focusedPos.x}%`,
                  top: `${focusedPos.y}%`,
                  transform: `translate(-50%, ${isBelow ? "70px" : "-160%"})`,
                }}>
                <div className="bg-[#0a1426]/95 backdrop-blur border border-white/10 rounded-lg px-3 py-2.5 w-60 shadow-2xl">
                  <div className="text-[11px] font-bold uppercase tracking-[0.15em]" style={{ color: focusedMeta.color }}>
                    {focusedMeta.label}
                  </div>
                  <div className="text-[11px] text-gray-300 mt-1.5 leading-snug">{focusedMeta.blurb}</div>
                  {(LINKS[focused] || []).length > 0 && (
                    <div className="mt-2.5 pt-2 border-t border-white/10">
                      <div className="text-[8px] uppercase tracking-[0.15em] text-gray-500 mb-1.5">Connects to</div>
                      <div className="flex flex-wrap gap-1">
                        {(LINKS[focused] || []).map(id => (
                          <span key={id} className="text-[9px] px-1.5 py-0.5 rounded"
                            style={{ color: CATS[id].color, backgroundColor: `${CATS[id].color}18` }}>
                            {CATS[id].label}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {(() => {
                    const cat = data.find(c => c.id === focused);
                    const total = cat?.logos.filter(l => l.live).length || 0;
                    if (total === 0) return null;
                    return (
                      <button
                        onClick={(e) => { e.stopPropagation(); setPanelCat(focused); }}
                        className="mt-2.5 w-full text-[10px] font-medium py-1.5 rounded border pointer-events-auto hover:bg-white/5 transition"
                        style={{ color: focusedMeta.color, borderColor: `${focusedMeta.color}40` }}>
                        See all {total} →
                      </button>
                    );
                  })()}
                </div>
              </div>
            );
          })()}
        </div>
      </div>

      {/* Side panel — full list of a category */}
      {panelCat !== null && (() => {
        const pMeta = CATS[panelCat];
        const pCat = data.find(c => c.id === panelCat);
        const logos = pCat?.logos.filter(l => l.live) || [];
        return (
          <div className="fixed inset-0 z-50">
            <button
              onClick={() => setPanelCat(null)}
              aria-label="Close panel"
              className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <div className="absolute right-0 top-0 h-full w-full max-w-md bg-[#0a1426] border-l border-white/10 shadow-2xl flex flex-col animate-in slide-in-from-right">
              <header className="px-6 py-5 border-b border-white/10 flex items-start justify-between gap-4">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-[0.18em]" style={{ color: pMeta.color }}>
                    {pMeta.label}
                  </div>
                  <div className="text-sm text-gray-300 mt-1.5 leading-snug">{pMeta.blurb}</div>
                  <div className="text-[11px] text-gray-500 mt-2 tabular-nums">{logos.length} companies</div>
                </div>
                <button
                  onClick={() => setPanelCat(null)}
                  className="text-gray-500 hover:text-white transition p-1 -m-1"
                  aria-label="Close">
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
                        <div className="w-full aspect-square rounded-md bg-white overflow-hidden flex items-center justify-center">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={logo.image || ""} alt=""
                            className="w-full h-full object-contain p-1.5"
                            onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                        </div>
                        <div className="text-[10px] text-gray-400 group-hover:text-white text-center line-clamp-2 leading-tight">
                          {logo.keywords?.[0] || "View company"}
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

      {/* Mobile list — stacked category sections */}
      <div className="md:hidden relative z-10 px-4 pb-10 pt-6 space-y-8">
        {(Object.keys(CATS) as unknown as string[]).map(k => parseInt(k)).map(catId => {
          const meta = CATS[catId];
          const cat = data.find(c => c.id === catId);
          if (!cat) return null;
          const liveLogos = cat.logos.filter(l => l.live);
          if (liveLogos.length === 0) return null;
          const visible = liveLogos.slice(0, 8);
          return (
            <section key={catId}>
              <div className="flex items-baseline justify-between gap-3 mb-3">
                <div className="min-w-0">
                  <div className="text-xs font-bold tracking-[0.15em] uppercase" style={{ color: meta.color }}>
                    {meta.label}
                  </div>
                  <div className="text-[11px] text-gray-400 mt-1 leading-snug">{meta.blurb}</div>
                </div>
                <div className="text-[10px] text-gray-500 tabular-nums whitespace-nowrap">{liveLogos.length}</div>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {visible.map((logo, i) => {
                  const cid = logo.url?.match(/companyPage\/(\d+)/)?.[1];
                  const k2 = `m-${catId}-${i}`;
                  const isMatch = matchKeys ? matchKeys.has(`${catId}-${i}`) : true;
                  return (
                    <Link key={k2} href={cid ? `/company/${cid}` : "#"}
                      className="aspect-square rounded-md bg-white overflow-hidden flex items-center justify-center transition"
                      style={{
                        boxShadow: (matchKeys && isMatch) ? `0 0 0 1.5px ${meta.color}` : undefined,
                        opacity: (matchKeys && !isMatch) ? 0.3 : 1,
                      }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={logo.image || ""} alt="" loading="lazy"
                        className="w-full h-full object-contain p-1.5"
                        onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                    </Link>
                  );
                })}
                {liveLogos.length > 8 && (
                  <button onClick={() => setPanelCat(catId)}
                    className="aspect-square rounded-md bg-white/5 border border-white/10 flex items-center justify-center text-xs font-semibold hover:bg-white/10 transition"
                    style={{ color: meta.color }}>
                    +{liveLogos.length - 8}
                  </button>
                )}
              </div>
            </section>
          );
        })}
      </div>

      {/* Legend — desktop only */}
      <div className="hidden md:flex max-w-5xl mx-auto px-6 py-5 flex-wrap justify-center gap-1.5 relative z-10">
        {Object.entries(CATS).map(([id, m]) => (
          <button key={id}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] text-gray-400 hover:text-white hover:bg-white/[0.06] transition-all"
            onMouseEnter={() => setFocused(parseInt(id))}
            onMouseLeave={() => setFocused(null)}>
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: m.color }} />
            {m.label}
          </button>
        ))}
      </div>
    </div>
  );
}

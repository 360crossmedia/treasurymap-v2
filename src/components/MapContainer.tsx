// MAP CORE — continent map architecture
// Territories positioned by treasury workflow: sources → core → execution → analytics
"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import type { MapCategory } from "@/lib/api";

type Zone = "sources" | "core" | "analytics" | "execution" | "adjacent";
type CatMeta = {
  label: string;
  color: string;
  blurb: string;
  area: string;
  zone: Zone;
};

const CATS: Record<number, CatMeta> = {
  0:  { label: "FIDP",        color: "#60A5FA", area: "fidp", zone: "sources",   blurb: "Financial instrument data providers — market & reference data." },
  1:  { label: "FDF",         color: "#A78BFA", area: "fdf",  zone: "sources",   blurb: "Financial data feeds — real-time price & rate streams." },
  8:  { label: "ETL",         color: "#2DD4BF", area: "etl",  zone: "sources",   blurb: "Data pipelines feeding the treasury stack." },

  7:  { label: "ERP",         color: "#F87171", area: "erp",  zone: "core",      blurb: "Enterprise Resource Planning — the financial source of truth." },
  12: { label: "Banking",     color: "#4ADE80", area: "bank", zone: "core",      blurb: "Bank connectivity & portals." },
  5:  { label: "TMS",         color: "#22D3EE", area: "tms",  zone: "core",      blurb: "Treasury Management Systems — the operational core." },

  6:  { label: "BI",          color: "#E879F9", area: "bi",   zone: "analytics", blurb: "Business Intelligence & treasury analytics." },
  10: { label: "CFF",         color: "#C084FC", area: "cff",  zone: "analytics", blurb: "Cash Flow Forecasting specialists." },

  4:  { label: "OTS",         color: "#FBBF24", area: "ots",  zone: "execution", blurb: "Order & Trade Systems for FX, MM, securities." },
  2:  { label: "CMA",         color: "#F472B6", area: "cma",  zone: "execution", blurb: "Capital Markets Applications — trading & portfolio tooling." },
  9:  { label: "FSC",         color: "#FB923C", area: "fsc",  zone: "execution", blurb: "Financial Supply Chain — payables, receivables, financing." },

  11: { label: "RegTech",     color: "#38BDF8", area: "reg",  zone: "adjacent",  blurb: "Regulatory, compliance & reporting technology." },
  13: { label: "Insurance",   color: "#FB7185", area: "ins",  zone: "adjacent",  blurb: "Insurance & hedging for treasury risk." },
  3:  { label: "Integrators", color: "#34D399", area: "int",  zone: "adjacent",  blurb: "System integrators connecting treasury stacks." },
  14: { label: "Other",       color: "#94A3B8", area: "oth",  zone: "adjacent",  blurb: "Adjacent & emerging treasury tools." },
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

// 12 cols × 8 rows territory grid. Each area must be a contiguous rectangle.
// Narrative west→east: data sources → core → execution → analytics/adjacent
const GRID_AREAS = `
  "fidp fidp erp  erp  bank bank bi   bi   cff  cff  cff  cff"
  "fidp fidp erp  erp  bank bank bi   bi   cff  cff  cff  cff"
  "fdf  fdf  tms  tms  tms  tms  ots  ots  fsc  fsc  fsc  fsc"
  "fdf  fdf  tms  tms  tms  tms  ots  ots  fsc  fsc  fsc  fsc"
  "etl  etl  tms  tms  tms  tms  ots  ots  fsc  fsc  fsc  fsc"
  "etl  etl  tms  tms  tms  tms  ots  ots  oth  oth  oth  oth"
  "int  int  reg  reg  ins  ins  cma  cma  oth  oth  oth  oth"
  "int  int  reg  reg  ins  ins  cma  cma  oth  oth  oth  oth"
`;

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

  // Deterministic starfield
  const stars = useMemo(() => {
    const out: { x: number; y: number; s: number; o: number }[] = [];
    let seed = 17;
    const rand = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
    const r2 = (n: number) => Math.round(n * 100) / 100;
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
        <div className="max-w-[1400px] mx-auto px-6 py-4 flex items-center gap-6 flex-wrap">
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
        {/* Narrative line */}
        <div className="max-w-[1400px] mx-auto px-6 pb-3">
          <div className="text-[10px] tracking-[0.2em] uppercase text-gray-600 flex items-center gap-2 flex-wrap">
            <span style={{ color: "#60A5FA" }}>Data sources</span>
            <span className="text-gray-700">→</span>
            <span style={{ color: "#22D3EE" }}>Core systems</span>
            <span className="text-gray-700">→</span>
            <span style={{ color: "#FBBF24" }}>Execution</span>
            <span className="text-gray-700">→</span>
            <span style={{ color: "#E879F9" }}>Analytics</span>
            <span className="text-gray-700 ml-4">·</span>
            <span className="text-gray-500">Adjacent ecosystem at the periphery</span>
          </div>
        </div>
      </div>

      {/* Continent map — desktop */}
      <div className="hidden md:block relative z-10 px-6 py-6">
        <div className="max-w-[1400px] mx-auto">
          <div
            className="grid gap-3 relative"
            style={{
              gridTemplateColumns: "repeat(12, 1fr)",
              gridTemplateRows: "repeat(8, minmax(95px, 1fr))",
              gridTemplateAreas: GRID_AREAS,
              minHeight: "calc(100vh - 180px)",
            }}
          >
            {allCatIds.map(catId => {
              const meta = CATS[catId];
              const cat = data.find(c => c.id === catId);
              if (!cat) return null;
              const liveLogos = cat.logos.filter(l => l.live);
              const count = liveLogos.length;
              if (count === 0) return null;

              const isFocused = focused === catId;
              const isLinked = focused !== null && !isFocused && (LINKS[focused] || []).includes(catId);
              const isDim = focused !== null && !isFocused && !isLinked;

              const maxVisible = isFocused ? 24 : 12;
              const visible = liveLogos.slice(0, maxVisible);
              const overflow = count - visible.length;

              return (
                <div
                  key={catId}
                  onMouseEnter={() => setFocused(catId)}
                  onMouseLeave={() => setFocused(null)}
                  className="relative rounded-2xl p-3 transition-all duration-300 overflow-hidden flex flex-col"
                  style={{
                    gridArea: meta.area,
                    background: `linear-gradient(135deg, ${meta.color}14 0%, ${meta.color}06 100%)`,
                    border: `1px solid ${isFocused ? meta.color + "aa" : isLinked ? meta.color + "55" : meta.color + "2a"}`,
                    boxShadow: isFocused
                      ? `inset 0 0 50px ${meta.color}22, 0 0 40px ${meta.color}33`
                      : `inset 0 0 25px ${meta.color}0c`,
                    opacity: isDim ? 0.4 : 1,
                  }}
                >
                  {/* Region header */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="min-w-0">
                      <div className="text-[11px] font-bold tracking-[0.15em] uppercase truncate" style={{ color: meta.color }}>
                        {meta.label}
                      </div>
                      <div className="text-[9px] text-gray-400 tabular-nums">
                        {count} {count > 1 ? "vendors" : "vendor"}
                      </div>
                    </div>
                    {count > maxVisible && (
                      <button
                        onClick={(e) => { e.stopPropagation(); setPanelCat(catId); }}
                        className="text-[9px] text-gray-500 hover:text-white transition whitespace-nowrap shrink-0"
                      >
                        See all →
                      </button>
                    )}
                  </div>

                  {/* Blurb — only show when focused */}
                  {isFocused && (
                    <div className="text-[10px] text-gray-300 leading-snug mb-2 line-clamp-2">
                      {meta.blurb}
                    </div>
                  )}

                  {/* Logo mini-grid */}
                  <div
                    className="grid gap-1.5 flex-1 content-start"
                    style={{ gridTemplateColumns: "repeat(auto-fill, minmax(54px, 1fr))" }}
                  >
                    {visible.map((logo, i) => {
                      const cid = logo.url?.match(/companyPage\/(\d+)/)?.[1];
                      const k = `${catId}-${i}`;
                      const isH = hovered === k;
                      const isMatch = matchKeys ? matchKeys.has(k) : true;

                      return (
                        <Link
                          key={k}
                          href={cid ? `/company/${cid}` : "#"}
                          className="relative aspect-square rounded-lg transition-all duration-200"
                          style={{
                            background: "rgba(255,255,255,0.035)",
                            border: `1px solid ${isH ? meta.color : "rgba(255,255,255,0.08)"}`,
                            transform: isH ? "translateY(-2px)" : "none",
                            boxShadow: isH
                              ? `0 8px 20px rgba(0,0,0,0.6), 0 0 0 1px ${meta.color}`
                              : undefined,
                            opacity: matchKeys && !isMatch ? 0.2 : 1,
                            zIndex: isH ? 40 : 1,
                          }}
                          onMouseEnter={() => setHovered(k)}
                          onMouseLeave={() => setHovered(null)}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={logo.image || ""}
                            alt=""
                            loading="lazy"
                            className="w-full h-full object-contain p-1.5"
                            style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.4))" }}
                            onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
                          />
                          {isH && (
                            <div className="absolute left-1/2 -top-8 -translate-x-1/2 pointer-events-none z-50">
                              <div className="px-2 py-1 rounded text-[10px] font-medium text-white whitespace-nowrap shadow-lg"
                                style={{ backgroundColor: meta.color }}>
                                {(logo.keywords?.[0] || "View").substring(0, 30)}
                              </div>
                            </div>
                          )}
                        </Link>
                      );
                    })}

                    {overflow > 0 && (
                      <button
                        onClick={(e) => { e.stopPropagation(); setPanelCat(catId); }}
                        className="aspect-square rounded-lg text-[10px] font-bold flex items-center justify-center hover:scale-105 transition"
                        style={{
                          background: `${meta.color}18`,
                          border: `1px dashed ${meta.color}66`,
                          color: meta.color,
                        }}
                      >
                        +{overflow}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Side panel — full list */}
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

      {/* Mobile — zones stacked, categories inside */}
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
                  const cat = data.find(c => c.id === catId);
                  if (!cat) return null;
                  const liveLogos = cat.logos.filter(l => l.live);
                  if (liveLogos.length === 0) return null;
                  const visible = liveLogos.slice(0, 8);
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
                        <div className="text-[10px] text-gray-500 tabular-nums shrink-0">{liveLogos.length}</div>
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
                        {liveLogos.length > 8 && (
                          <button onClick={() => setPanelCat(catId)}
                            className="aspect-square rounded-lg text-xs font-semibold flex items-center justify-center"
                            style={{
                              color: meta.color,
                              background: `${meta.color}18`,
                              border: `1px dashed ${meta.color}66`,
                            }}>
                            +{liveLogos.length - 8}
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

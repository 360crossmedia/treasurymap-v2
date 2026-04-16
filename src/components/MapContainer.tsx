// MAP CORE — do not refactor without explicit instruction
"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import type { MapCategory } from "@/lib/api";

const CATS: Record<number, { label: string; color: string }> = {
  0:  { label: "FIDP",        color: "#3B82F6" },
  1:  { label: "FDF",         color: "#818CF8" },
  2:  { label: "CMA",         color: "#F472B6" },
  3:  { label: "Integrators", color: "#34D399" },
  4:  { label: "OTS",         color: "#FBBF24" },
  5:  { label: "TMS/TRMS",    color: "#22D3EE" },
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

// Place each category cluster on the canvas (percentage-based x,y)
// Spread organically like a galaxy — not a grid
const CLUSTER_POS: Record<number, { x: number; y: number }> = {
  5:  { x: 50, y: 50 },  // TMS center (largest)
  0:  { x: 20, y: 18 },  // FIDP top-left
  1:  { x: 80, y: 15 },  // FDF top-right
  2:  { x: 82, y: 52 },  // CMA right
  3:  { x: 50, y: 20 },  // Integrators top-center
  4:  { x: 15, y: 50 },  // OTS left
  6:  { x: 35, y: 78 },  // BI bottom-left
  7:  { x: 65, y: 80 },  // ERP bottom-right
  8:  { x: 85, y: 80 },  // ETL far-right-bottom
  9:  { x: 50, y: 82 },  // FSC bottom-center
  10: { x: 18, y: 78 },  // CFF far-left-bottom
  11: { x: 15, y: 35 },  // RegTech left-upper
  12: { x: 75, y: 38 },  // Banking right-upper
  13: { x: 35, y: 35 },  // Insurance left-center
  14: { x: 88, y: 35 },  // Other far-right
};

interface Props { initialData?: MapCategory[] }

export function MapContainer({ initialData }: Props) {
  const [data, setData] = useState<MapCategory[]>(initialData || []);
  const [loading, setLoading] = useState(!initialData);
  const [search, setSearch] = useState("");
  const [hqFilter, setHqFilter] = useState("");
  const [hoveredCluster, setHoveredCluster] = useState<number | null>(null);
  const [hoveredLogo, setHoveredLogo] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!initialData) {
      fetch("https://treasurymapbackend-production.up.railway.app/api/v1/mapdata")
        .then(r => r.json())
        .then(d => { setData(d); setLoading(false); })
        .catch(() => setLoading(false));
    }
  }, [initialData]);

  const filtered = useMemo(() => data.map(cat => ({
    ...cat,
    logos: cat.logos.filter(l => {
      if (!l.live) return false;
      if (search && !l.keywords?.some(k => k.toLowerCase().includes(search.toLowerCase()))) return false;
      if (hqFilter && !l.headequarterLocation?.toLowerCase().includes(hqFilter.toLowerCase())) return false;
      return true;
    }),
  })), [data, search, hqFilter]);

  const total = filtered.reduce((a, c) => a + c.logos.length, 0);

  // Generate positions for logos within a cluster (spiral layout)
  function logoPositions(count: number, baseSize: number) {
    const positions: { dx: number; dy: number }[] = [];
    const goldenAngle = 137.508 * (Math.PI / 180);
    for (let i = 0; i < count; i++) {
      const r = baseSize * 0.35 * Math.sqrt(i + 1);
      const theta = i * goldenAngle;
      positions.push({ dx: r * Math.cos(theta), dy: r * Math.sin(theta) });
    }
    return positions;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[80vh] bg-[#070B14]">
        <div className="w-10 h-10 border-2 border-gray-800 border-t-cyan-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-[#070B14] min-h-screen">
      {/* Search bar */}
      <div className="sticky top-16 z-40 bg-[#070B14]/80 backdrop-blur-2xl border-b border-white/[0.04]">
        <div className="max-w-7xl mx-auto px-5 py-3 flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input type="text" placeholder="Search companies..." value={search} onChange={e => setSearch(e.target.value)}
              className="w-full bg-white/[0.04] border border-white/[0.06] rounded-xl pl-10 pr-4 py-2.5 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-cyan-500/30 transition-all" />
          </div>
          <input type="text" placeholder="HQ location..." value={hqFilter} onChange={e => setHqFilter(e.target.value)}
            className="bg-white/[0.04] border border-white/[0.06] rounded-xl px-4 py-2.5 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-cyan-500/30 transition-all w-40" />
          <span className="text-[11px] text-gray-600 ml-auto hidden sm:block">{total} companies</span>
          {(search || hqFilter) && <button onClick={() => { setSearch(""); setHqFilter(""); }} className="text-xs text-gray-600 hover:text-gray-300">Clear</button>}
        </div>
      </div>

      {/* Title */}
      <div className="text-center pt-8 pb-2">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white/90">The Treasury Technology Landscape</h1>
        <p className="mt-2 text-sm text-gray-600">{total} solutions · {filtered.filter(c => c.logos.length > 0).length} categories</p>
      </div>

      {/* MAP — full width constellation */}
      <div ref={containerRef} className="relative w-full overflow-hidden" style={{ height: "max(75vh, 700px)" }}>
        {/* Subtle radial gradient background */}
        <div className="absolute inset-0" style={{ background: "radial-gradient(circle at 50% 50%, rgba(6,182,212,0.03) 0%, transparent 60%)" }} />

        {/* Category clusters */}
        {filtered.filter(c => c.logos.length > 0).map(cat => {
          const meta = CATS[cat.id];
          const pos = CLUSTER_POS[cat.id];
          if (!meta || !pos) return null;

          const isHovered = hoveredCluster === cat.id;
          const isOtherHovered = hoveredCluster !== null && hoveredCluster !== cat.id;
          const scale = isHovered ? 1.15 : isOtherHovered ? 0.85 : 1;
          const opacity = isOtherHovered ? 0.3 : 1;
          const clusterSize = Math.min(220, 80 + cat.logos.length * 4);
          const positions = logoPositions(cat.logos.length, clusterSize);

          return (
            <div
              key={cat.id}
              className="absolute transition-all duration-700 ease-out"
              style={{
                left: `${pos.x}%`,
                top: `${pos.y}%`,
                transform: `translate(-50%, -50%) scale(${scale})`,
                opacity,
                zIndex: isHovered ? 20 : 1,
              }}
              onMouseEnter={() => setHoveredCluster(cat.id)}
              onMouseLeave={() => setHoveredCluster(null)}
            >
              {/* Cluster glow */}
              <div className="absolute rounded-full transition-all duration-700" style={{
                width: clusterSize * 2.5,
                height: clusterSize * 2.5,
                left: -(clusterSize * 1.25),
                top: -(clusterSize * 1.25),
                background: `radial-gradient(circle, ${meta.color}${isHovered ? "18" : "08"} 0%, transparent 70%)`,
              }} />

              {/* Category label */}
              <div className="absolute -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none z-10" style={{ left: 0, top: 0 }}>
                <span className="text-[11px] font-bold tracking-wider uppercase" style={{ color: meta.color, textShadow: `0 0 20px ${meta.color}40` }}>
                  {meta.label}
                </span>
                <span className="block text-[9px] text-gray-600 mt-0.5">{cat.logos.length}</span>
              </div>

              {/* Logos in spiral */}
              {cat.logos.map((logo, i) => {
                if (i >= positions.length) return null;
                const { dx, dy } = positions[i];
                const cid = logo.url?.match(/companyPage\/(\d+)/)?.[1];
                const key = `${cat.id}-${i}`;
                const isLogoHovered = hoveredLogo === key;
                const logoSize = isHovered ? 38 : 30;

                return (
                  <Link
                    key={key}
                    href={cid ? `/company/${cid}` : "#"}
                    className="absolute transition-all duration-500"
                    style={{
                      left: dx - logoSize / 2,
                      top: dy - logoSize / 2,
                      zIndex: isLogoHovered ? 30 : 2,
                    }}
                    onMouseEnter={() => setHoveredLogo(key)}
                    onMouseLeave={() => setHoveredLogo(null)}
                  >
                    <div
                      className="rounded-full overflow-hidden flex items-center justify-center transition-all duration-300"
                      style={{
                        width: logoSize,
                        height: logoSize,
                        backgroundColor: isLogoHovered ? "white" : "rgba(255,255,255,0.92)",
                        boxShadow: isLogoHovered
                          ? `0 0 0 2px ${meta.color}, 0 8px 24px rgba(0,0,0,0.5)`
                          : "0 1px 4px rgba(0,0,0,0.3)",
                        transform: isLogoHovered ? "scale(1.4)" : "scale(1)",
                      }}
                    >
                      {logo.image ? (
                        <Image
                          src={logo.image}
                          alt={logo.keywords?.[0] || ""}
                          width={logoSize - 6}
                          height={logoSize - 6}
                          className="object-contain rounded-full"
                          unoptimized
                        />
                      ) : (
                        <span className="text-[7px] text-gray-400">?</span>
                      )}
                    </div>

                    {/* Tooltip */}
                    {isLogoHovered && (
                      <div className="absolute z-50 -top-10 left-1/2 -translate-x-1/2 pointer-events-none">
                        <div className="px-3 py-1.5 rounded-lg text-[10px] font-medium text-white whitespace-nowrap shadow-xl"
                          style={{ backgroundColor: meta.color }}>
                          {(logo.keywords?.[0] || "View company").substring(0, 25)}
                        </div>
                        <div className="w-2 h-2 rotate-45 mx-auto -mt-1" style={{ backgroundColor: meta.color }} />
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
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-wrap justify-center gap-3">
          {Object.entries(CATS).map(([id, meta]) => {
            const cat = filtered.find(c => c.id === parseInt(id));
            if (!cat || cat.logos.length === 0) return null;
            return (
              <button key={id}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-[11px] font-medium text-gray-500 hover:text-gray-300 hover:bg-white/[0.04] transition-all"
                onMouseEnter={() => setHoveredCluster(parseInt(id))}
                onMouseLeave={() => setHoveredCluster(null)}
              >
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: meta.color }} />
                {meta.label}
                <span className="opacity-40">{cat.logos.length}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

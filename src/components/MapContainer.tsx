// MAP CORE — do not refactor without explicit instruction
"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import type { MapCategory } from "@/lib/api";

const CAT_META: Record<number, { label: string; full: string; color: string; angle: number }> = {
  0:  { label: "FIDP",       full: "Financial Instrument Dealing Platform", color: "#3B82F6", angle: 0 },
  1:  { label: "FDF",        full: "Financial Data Feeding",               color: "#6366F1", angle: 24 },
  2:  { label: "CMA",        full: "Currency Management Automation",       color: "#EC4899", angle: 48 },
  3:  { label: "Integrators",full: "Integrators & Consultants",            color: "#10B981", angle: 72 },
  4:  { label: "OTS",        full: "Other Treasury Solutions",             color: "#F59E0B", angle: 96 },
  5:  { label: "TMS",        full: "Treasury Management Systems",          color: "#06B6D4", angle: 120 },
  6:  { label: "BI",         full: "BI & Analytics",                       color: "#8B5CF6", angle: 144 },
  7:  { label: "ERP",        full: "Enterprise Resource Planning",         color: "#EF4444", angle: 168 },
  8:  { label: "ETL",        full: "Extract Transform Load",              color: "#14B8A6", angle: 192 },
  9:  { label: "FSC",        full: "Financial Supply Chain",               color: "#F97316", angle: 216 },
  10: { label: "CFF",        full: "Cash-Flow Forecasting",               color: "#A855F7", angle: 240 },
  11: { label: "RegTech",    full: "Regulatory Technology",                color: "#0EA5E9", angle: 264 },
  12: { label: "Banking",    full: "Banking Solutions",                    color: "#22C55E", angle: 288 },
  13: { label: "Insurance",  full: "Insurance Solutions",                  color: "#E11D48", angle: 312 },
  14: { label: "Other",      full: "Other Solutions",                      color: "#64748B", angle: 336 },
};

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = (angleDeg - 90) * (Math.PI / 180);
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

interface MapContainerProps {
  initialData?: MapCategory[];
}

export function MapContainer({ initialData }: MapContainerProps) {
  const [data, setData] = useState<MapCategory[]>(initialData || []);
  const [loading, setLoading] = useState(!initialData);
  const [expandedCat, setExpandedCat] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [hqFilter, setHqFilter] = useState("");
  const [hoveredCompany, setHoveredCompany] = useState<string | null>(null);

  useEffect(() => {
    if (!initialData) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL || "https://treasurymapbackend-production.up.railway.app/api/v1"}/mapdata`)
        .then((r) => r.json())
        .then((d) => { setData(d); setLoading(false); })
        .catch(() => setLoading(false));
    }
  }, [initialData]);

  const filteredData = useMemo(() => {
    return data.map((cat) => ({
      ...cat,
      logos: cat.logos.filter((logo) => {
        if (!logo.live) return false;
        if (searchQuery) {
          const q = searchQuery.toLowerCase();
          if (!logo.keywords?.some((k) => k.toLowerCase().includes(q))) return false;
        }
        if (hqFilter) {
          if (!logo.headequarterLocation?.toLowerCase().includes(hqFilter.toLowerCase())) return false;
        }
        return true;
      }),
    }));
  }, [data, searchQuery, hqFilter]);

  const totalCompanies = filteredData.reduce((a, c) => a + c.logos.length, 0);

  // Map dimensions
  const W = 1200;
  const H = 900;
  const CX = W / 2;
  const CY = H / 2;
  const ORBIT_R = 300; // category orbit radius
  const LOGO_R_BASE = 90; // logo orbit radius from category node

  const handleCatClick = useCallback((id: number) => {
    setExpandedCat((prev) => (prev === id ? null : id));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[80vh] bg-[#060B18]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-gray-800 border-t-cyan-500 rounded-full animate-spin" />
          <span className="text-sm text-gray-600 tracking-wide">Mapping the treasury landscape...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#060B18] min-h-screen">
      {/* Search */}
      <div className="sticky top-16 z-30 bg-[#060B18]/80 backdrop-blur-2xl border-b border-white/[0.04]">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search companies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/[0.04] border border-white/[0.06] rounded-xl pl-10 pr-4 py-2.5 text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:border-cyan-500/30 focus:bg-white/[0.06] transition-all"
            />
          </div>
          <input
            type="text"
            placeholder="HQ location..."
            value={hqFilter}
            onChange={(e) => setHqFilter(e.target.value)}
            className="bg-white/[0.04] border border-white/[0.06] rounded-xl px-4 py-2.5 text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:border-cyan-500/30 transition-all w-40"
          />
          <div className="hidden sm:flex items-center gap-1.5 ml-auto">
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
            <span className="text-[11px] text-gray-500 tracking-wide">{totalCompanies} companies</span>
          </div>
          {(searchQuery || hqFilter) && (
            <button onClick={() => { setSearchQuery(""); setHqFilter(""); }} className="text-xs text-gray-600 hover:text-gray-300">Clear</button>
          )}
        </div>
      </div>

      {/* Constellation map */}
      <div className="flex justify-center overflow-hidden px-4 py-4">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-full max-w-[1200px]"
          style={{ maxHeight: "calc(100vh - 140px)" }}
        >
          <defs>
            {/* Radial glow for center */}
            <radialGradient id="centerGlow">
              <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.3" />
              <stop offset="50%" stopColor="#06B6D4" stopOpacity="0.05" />
              <stop offset="100%" stopColor="#06B6D4" stopOpacity="0" />
            </radialGradient>
            {/* Category node glows */}
            {Object.entries(CAT_META).map(([id, meta]) => (
              <radialGradient key={id} id={`glow-${id}`}>
                <stop offset="0%" stopColor={meta.color} stopOpacity="0.4" />
                <stop offset="100%" stopColor={meta.color} stopOpacity="0" />
              </radialGradient>
            ))}
          </defs>

          {/* Subtle orbit rings */}
          <circle cx={CX} cy={CY} r={ORBIT_R} fill="none" stroke="white" strokeOpacity="0.03" strokeWidth="1" />
          <circle cx={CX} cy={CY} r={ORBIT_R * 0.5} fill="none" stroke="white" strokeOpacity="0.02" strokeWidth="1" strokeDasharray="4 8" />

          {/* Connection lines from center to categories */}
          {filteredData.map((cat) => {
            const meta = CAT_META[cat.id];
            if (!meta || cat.logos.length === 0) return null;
            const pos = polarToCartesian(CX, CY, ORBIT_R, meta.angle);
            const isExpanded = expandedCat === cat.id;
            return (
              <line
                key={`line-${cat.id}`}
                x1={CX} y1={CY}
                x2={pos.x} y2={pos.y}
                stroke={meta.color}
                strokeOpacity={isExpanded ? 0.3 : 0.08}
                strokeWidth={isExpanded ? 1.5 : 0.5}
                className="transition-all duration-700"
              />
            );
          })}

          {/* Center glow */}
          <circle cx={CX} cy={CY} r="120" fill="url(#centerGlow)" />

          {/* Center node */}
          <circle cx={CX} cy={CY} r="40" fill="#0C1425" stroke="#06B6D4" strokeWidth="1.5" strokeOpacity="0.5" />
          <circle cx={CX} cy={CY} r="28" fill="#06B6D4" fillOpacity="0.1" />
          <text x={CX} y={CY - 6} textAnchor="middle" className="fill-cyan-400 text-[10px] font-bold tracking-[0.15em]">TREASURY</text>
          <text x={CX} y={CY + 8} textAnchor="middle" className="fill-cyan-400/60 text-[8px] tracking-[0.2em]">MAP</text>

          {/* Category nodes + their company logos */}
          {filteredData.map((cat) => {
            const meta = CAT_META[cat.id];
            if (!meta || cat.logos.length === 0) return null;

            const catPos = polarToCartesian(CX, CY, ORBIT_R, meta.angle);
            const isExpanded = expandedCat === cat.id;
            const isOtherExpanded = expandedCat !== null && expandedCat !== cat.id;
            const nodeR = isExpanded ? 36 : 26;
            const logoOrbitR = isExpanded ? Math.min(140, 60 + cat.logos.length * 2.5) : LOGO_R_BASE;

            // Position logos around the category node
            const angleStep = cat.logos.length > 0 ? 360 / Math.min(cat.logos.length, 20) : 0;

            return (
              <g
                key={`cat-${cat.id}`}
                className="transition-all duration-700"
                opacity={isOtherExpanded ? 0.15 : 1}
              >
                {/* Glow behind node */}
                <circle cx={catPos.x} cy={catPos.y} r={isExpanded ? 100 : 50} fill={`url(#glow-${cat.id})`} className="transition-all duration-700" />

                {/* Company logo connections (dashed lines from cat node to logos) */}
                {(isExpanded || expandedCat === null) && cat.logos.slice(0, 20).map((logo, i) => {
                  const angle = meta.angle + (i - cat.logos.length / 2) * (isExpanded ? angleStep * 0.9 : 8) + (isExpanded ? 0 : -cat.logos.length * 2);
                  const logoPos = polarToCartesian(catPos.x, catPos.y, logoOrbitR, angle);
                  return (
                    <line
                      key={`conn-${cat.id}-${i}`}
                      x1={catPos.x} y1={catPos.y}
                      x2={logoPos.x} y2={logoPos.y}
                      stroke={meta.color}
                      strokeOpacity={isExpanded ? 0.15 : 0.04}
                      strokeWidth="0.5"
                      strokeDasharray={isExpanded ? "none" : "2 4"}
                      className="transition-all duration-700"
                    />
                  );
                })}

                {/* Company logos */}
                {(isExpanded || expandedCat === null) && cat.logos.slice(0, isExpanded ? 40 : 12).map((logo, i) => {
                  const angle = meta.angle + (i - Math.min(cat.logos.length, isExpanded ? 40 : 12) / 2) * (isExpanded ? angleStep * 0.85 : 10);
                  const tier = isExpanded && i >= 20 ? 1 : 0;
                  const r = logoOrbitR + tier * 50;
                  const logoPos = polarToCartesian(catPos.x, catPos.y, r, angle);
                  const companyId = logo.url?.match(/companyPage\/(\d+)/)?.[1];
                  const key = `${cat.id}-${i}`;
                  const isHovered = hoveredCompany === key;
                  const size = isExpanded ? 40 : 30;

                  // Don't render if outside viewport
                  if (logoPos.x < -50 || logoPos.x > W + 50 || logoPos.y < -50 || logoPos.y > H + 50) return null;

                  return (
                    <g key={key}>
                      <Link
                        href={companyId ? `/company/${companyId}` : "#"}
                        onMouseEnter={() => setHoveredCompany(key)}
                        onMouseLeave={() => setHoveredCompany(null)}
                      >
                        {/* Logo container */}
                        <rect
                          x={logoPos.x - size / 2}
                          y={logoPos.y - size * 0.3}
                          width={size}
                          height={size * 0.6}
                          rx="4"
                          fill="white"
                          stroke={isHovered ? meta.color : "transparent"}
                          strokeWidth={isHovered ? "1.5" : "0"}
                          className="transition-all duration-300 drop-shadow-sm"
                          style={isHovered ? { filter: `drop-shadow(0 0 8px ${meta.color}44)` } : {}}
                        />
                        {/* Company logo image */}
                        <image
                          href={logo.image || ""}
                          x={logoPos.x - size / 2 + 3}
                          y={logoPos.y - size * 0.3 + 3}
                          width={size - 6}
                          height={size * 0.6 - 6}
                          preserveAspectRatio="xMidYMid meet"
                        />
                      </Link>
                      {/* Tooltip */}
                      {isHovered && (
                        <g>
                          <rect
                            x={logoPos.x - 50}
                            y={logoPos.y - size * 0.3 - 26}
                            width="100"
                            height="20"
                            rx="6"
                            fill={meta.color}
                          />
                          <text
                            x={logoPos.x}
                            y={logoPos.y - size * 0.3 - 13}
                            textAnchor="middle"
                            className="fill-white text-[9px] font-medium"
                          >
                            {(logo.keywords?.[0] || "View").substring(0, 18)}
                          </text>
                        </g>
                      )}
                    </g>
                  );
                })}

                {/* Category node */}
                <g
                  className="cursor-pointer"
                  onClick={() => handleCatClick(cat.id)}
                >
                  <circle
                    cx={catPos.x} cy={catPos.y} r={nodeR}
                    fill="#0C1425"
                    stroke={meta.color}
                    strokeWidth={isExpanded ? 2 : 1}
                    strokeOpacity={isExpanded ? 0.8 : 0.4}
                    className="transition-all duration-500"
                  />
                  <circle
                    cx={catPos.x} cy={catPos.y} r={nodeR - 4}
                    fill={meta.color}
                    fillOpacity={isExpanded ? 0.15 : 0.08}
                    className="transition-all duration-500"
                  />
                  <text
                    x={catPos.x} y={catPos.y - 2}
                    textAnchor="middle"
                    fill={meta.color}
                    className={`font-bold tracking-wide ${isExpanded ? "text-[10px]" : "text-[8px]"}`}
                  >
                    {meta.label}
                  </text>
                  <text
                    x={catPos.x} y={catPos.y + 10}
                    textAnchor="middle"
                    fill="white"
                    fillOpacity="0.3"
                    className="text-[7px]"
                  >
                    {cat.logos.length}
                  </text>
                </g>

                {/* Overflow indicator */}
                {!isExpanded && cat.logos.length > 12 && (
                  <text
                    x={catPos.x + nodeR + 8}
                    y={catPos.y + 4}
                    fill={meta.color}
                    fillOpacity="0.4"
                    className="text-[8px] cursor-pointer"
                    onClick={() => handleCatClick(cat.id)}
                  >
                    +{cat.logos.length - 12}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Legend bar */}
      <div className="max-w-7xl mx-auto px-6 pb-10">
        <div className="flex flex-wrap justify-center gap-2">
          {Object.entries(CAT_META).map(([id, meta]) => {
            const cat = filteredData.find((c) => c.id === parseInt(id));
            if (!cat || cat.logos.length === 0) return null;
            const isActive = expandedCat === parseInt(id);
            return (
              <button
                key={id}
                onClick={() => handleCatClick(parseInt(id))}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-medium transition-all duration-300 ${
                  isActive
                    ? "bg-white/10 text-white ring-1"
                    : "text-gray-500 hover:text-gray-300 hover:bg-white/[0.03]"
                }`}
                style={isActive ? { boxShadow: `inset 0 0 0 1px ${meta.color}`, color: meta.color } : {}}
              >
                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: meta.color }} />
                {meta.label}
                <span className="opacity-50">{cat.logos.length}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

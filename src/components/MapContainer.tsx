// MAP CORE — do not refactor without explicit instruction
"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import type { MapCategory } from "@/lib/api";

// Each zone is a blob/region on the map canvas
// x,y are percentage-based positions on a 100x100 grid
const ZONES: Record<number, { x: number; y: number; w: number; h: number; color: string; glow: string }> = {
  0:  { x: 0,  y: 0,  w: 25, h: 20, color: "#3B82F6", glow: "rgba(59,130,246,0.12)" },   // FIDP - blue
  1:  { x: 25, y: 0,  w: 20, h: 20, color: "#6366F1", glow: "rgba(99,102,241,0.12)" },   // FDF - indigo
  2:  { x: 45, y: 0,  w: 20, h: 20, color: "#EC4899", glow: "rgba(236,72,153,0.12)" },   // CMA - pink
  3:  { x: 65, y: 0,  w: 35, h: 22, color: "#10B981", glow: "rgba(16,185,129,0.12)" },   // Integrators - emerald
  4:  { x: 0,  y: 20, w: 22, h: 22, color: "#F59E0B", glow: "rgba(245,158,11,0.12)" },   // OTS - amber
  5:  { x: 22, y: 20, w: 30, h: 25, color: "#06B6D4", glow: "rgba(6,182,212,0.12)" },    // TMS - cyan (large)
  6:  { x: 52, y: 22, w: 22, h: 20, color: "#8B5CF6", glow: "rgba(139,92,246,0.12)" },   // BI - violet
  7:  { x: 74, y: 22, w: 26, h: 20, color: "#EF4444", glow: "rgba(239,68,68,0.12)" },    // ERP - red
  8:  { x: 0,  y: 42, w: 20, h: 18, color: "#14B8A6", glow: "rgba(20,184,166,0.12)" },   // ETL - teal
  9:  { x: 20, y: 45, w: 25, h: 20, color: "#F97316", glow: "rgba(249,115,22,0.12)" },   // FSC - orange
  10: { x: 45, y: 42, w: 25, h: 20, color: "#A855F7", glow: "rgba(168,85,247,0.12)" },   // CFF - purple
  11: { x: 70, y: 42, w: 30, h: 20, color: "#0EA5E9", glow: "rgba(14,165,233,0.12)" },   // RegTech - sky
  12: { x: 0,  y: 62, w: 35, h: 20, color: "#22C55E", glow: "rgba(34,197,94,0.12)" },    // Banking - green
  13: { x: 35, y: 65, w: 30, h: 18, color: "#E11D48", glow: "rgba(225,29,72,0.12)" },    // Insurance - rose
  14: { x: 65, y: 62, w: 35, h: 20, color: "#64748B", glow: "rgba(100,116,139,0.12)" },  // Other - slate
};

const CAT_NAMES: Record<number, { short: string; full: string }> = {
  0:  { short: "FIDP",      full: "Financial Instrument Dealing Platform" },
  1:  { short: "FDF",       full: "Financial Data Feeding" },
  2:  { short: "CMA",       full: "Currency Management Automation" },
  3:  { short: "Integrators", full: "Integrators & Consultants" },
  4:  { short: "OTS",       full: "Other Treasury Solutions" },
  5:  { short: "TMS",       full: "Treasury Management Systems" },
  6:  { short: "BI",        full: "BI & Analytics" },
  7:  { short: "ERP",       full: "Enterprise Resource Planning" },
  8:  { short: "ETL",       full: "Extract Transform Load" },
  9:  { short: "FSC",       full: "Financial Supply Chain" },
  10: { short: "CFF",       full: "Cash-Flow Forecasting" },
  11: { short: "RegTech",   full: "Regulatory Technology" },
  12: { short: "Banking",   full: "Banking Solutions" },
  13: { short: "Insurance", full: "Insurance Solutions" },
  14: { short: "Other",     full: "Other Solutions" },
};

interface MapContainerProps {
  initialData?: MapCategory[];
}

export function MapContainer({ initialData }: MapContainerProps) {
  const [data, setData] = useState<MapCategory[]>(initialData || []);
  const [loading, setLoading] = useState(!initialData);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
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
          const matchKeywords = logo.keywords?.some((k) => k.toLowerCase().includes(q));
          if (!matchKeywords) return false;
        }
        if (hqFilter) {
          if (!logo.headequarterLocation?.toLowerCase().includes(hqFilter.toLowerCase())) return false;
        }
        return true;
      }),
    }));
  }, [data, searchQuery, hqFilter]);

  const totalCompanies = filteredData.reduce((a, c) => a + c.logos.length, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[80vh] bg-[#0B1121]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-gray-700 border-t-blue-500 rounded-full animate-spin" />
          <span className="text-sm text-gray-500">Loading treasury landscape...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0B1121] min-h-screen">
      {/* Search bar */}
      <div className="sticky top-16 z-30 bg-[#0B1121]/90 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-[1400px] mx-auto px-4 py-3 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search companies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:bg-white/8 transition-all"
            />
          </div>
          <input
            type="text"
            placeholder="HQ location..."
            value={hqFilter}
            onChange={(e) => setHqFilter(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 transition-all w-44"
          />
          <span className="text-xs text-gray-500 ml-auto">{totalCompanies} companies</span>
          {(searchQuery || hqFilter || selectedCategory !== null) && (
            <button
              onClick={() => { setSearchQuery(""); setHqFilter(""); setSelectedCategory(null); }}
              className="text-xs text-gray-500 hover:text-white transition-colors"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* The Map */}
      <div className="max-w-[1400px] mx-auto px-4 py-6">
        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-white/90 tracking-tight">
            The Treasury Technology Landscape
          </h1>
          <p className="mt-2 text-sm text-gray-500">{totalCompanies} solutions mapped</p>
        </div>

        {/* Map canvas - the zones are positioned as a responsive grid of blobs */}
        <div className="relative" style={{ aspectRatio: "16/10" }}>
          {/* Grid lines / subtle background pattern */}
          <div className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
              backgroundSize: "60px 60px"
            }}
          />

          {/* Category zones */}
          {filteredData
            .filter((cat) => selectedCategory === null || cat.id === selectedCategory)
            .map((cat) => {
              const zone = ZONES[cat.id];
              const names = CAT_NAMES[cat.id] || { short: cat.categoryName, full: cat.categoryName };
              if (!zone || cat.logos.length === 0) return null;

              const isSelected = selectedCategory === cat.id;
              const opacity = selectedCategory === null || isSelected ? 1 : 0.2;

              return (
                <div
                  key={cat.id}
                  className="absolute rounded-2xl transition-all duration-500 overflow-hidden cursor-pointer"
                  style={{
                    left: `${zone.x}%`,
                    top: `${zone.y}%`,
                    width: `${zone.w}%`,
                    height: `${zone.h}%`,
                    backgroundColor: zone.glow,
                    borderColor: `${zone.color}33`,
                    borderWidth: 1,
                    borderStyle: "solid",
                    opacity,
                    padding: "10px",
                  }}
                  onClick={() => setSelectedCategory(isSelected ? null : cat.id)}
                >
                  {/* Zone label */}
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: zone.color }} />
                    <span className="text-[11px] font-bold tracking-wide" style={{ color: zone.color }}>
                      {names.short}
                    </span>
                    <span className="text-[9px] text-gray-500 hidden sm:inline">
                      {names.full}
                    </span>
                    <span className="text-[9px] font-medium ml-auto" style={{ color: `${zone.color}99` }}>
                      {cat.logos.length}
                    </span>
                  </div>

                  {/* Logos flowing inside the zone */}
                  <div className="flex flex-wrap gap-[3px] content-start overflow-hidden" style={{ maxHeight: "calc(100% - 26px)" }}>
                    {cat.logos.map((logo, i) => {
                      const companyId = logo.url?.match(/companyPage\/(\d+)/)?.[1];
                      const key = `${cat.id}-${i}`;
                      return (
                        <Link
                          key={key}
                          href={companyId ? `/company/${companyId}` : "#"}
                          onClick={(e) => e.stopPropagation()}
                          onMouseEnter={() => setHoveredCompany(key)}
                          onMouseLeave={() => setHoveredCompany(null)}
                          className="relative"
                        >
                          <div className={`w-[44px] h-[24px] bg-white rounded-[4px] flex items-center justify-center transition-all ${
                            hoveredCompany === key ? "shadow-lg scale-125 z-20 ring-1" : "shadow-sm"
                          }`}
                            style={hoveredCompany === key ? { boxShadow: `0 0 0 2px ${zone.color}` } : {}}
                          >
                            {logo.image ? (
                              <Image
                                src={logo.image}
                                alt={logo.keywords?.[0] || ""}
                                width={38}
                                height={18}
                                className="object-contain max-h-[18px]"
                                unoptimized
                              />
                            ) : (
                              <span className="text-[6px] text-gray-300">?</span>
                            )}
                          </div>
                          {/* Tooltip */}
                          {hoveredCompany === key && (
                            <div
                              className="absolute z-50 -top-9 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-lg text-[10px] font-medium whitespace-nowrap pointer-events-none shadow-xl"
                              style={{ backgroundColor: zone.color, color: "white" }}
                            >
                              {logo.keywords?.[0] || "View company"}
                              <div
                                className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[4px] border-r-[4px] border-t-[4px] border-transparent"
                                style={{ borderTopColor: zone.color }}
                              />
                            </div>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              );
            })}
        </div>

        {/* Legend */}
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {filteredData.filter(c => c.logos.length > 0).map((cat) => {
            const zone = ZONES[cat.id];
            const names = CAT_NAMES[cat.id];
            if (!zone || !names) return null;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-medium transition-all ${
                  selectedCategory === cat.id
                    ? "bg-white text-gray-900 shadow-lg"
                    : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-gray-300"
                }`}
              >
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: zone.color }} />
                {names.short}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

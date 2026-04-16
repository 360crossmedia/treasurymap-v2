// MAP CORE — do not refactor without explicit instruction
"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import type { MapCategory } from "@/lib/api";

const CAT_META: Record<number, { label: string; full: string; color: string; angle: number }> = {
  0:  { label: "FIDP",       full: "Financial Instrument Dealing Platform", color: "#3B82F6", angle: 0 },
  1:  { label: "FDF",        full: "Financial Data Feeding",               color: "#818CF8", angle: 24 },
  2:  { label: "CMA",        full: "Currency Management Automation",       color: "#F472B6", angle: 48 },
  3:  { label: "Integrators",full: "Integrators & Consultants",            color: "#34D399", angle: 72 },
  4:  { label: "OTS",        full: "Other Treasury Solutions",             color: "#FBBF24", angle: 96 },
  5:  { label: "TMS",        full: "Treasury Management Systems",          color: "#22D3EE", angle: 120 },
  6:  { label: "BI",         full: "BI & Analytics",                       color: "#A78BFA", angle: 144 },
  7:  { label: "ERP",        full: "Enterprise Resource Planning",         color: "#F87171", angle: 168 },
  8:  { label: "ETL",        full: "Extract Transform Load",              color: "#2DD4BF", angle: 192 },
  9:  { label: "FSC",        full: "Financial Supply Chain",               color: "#FB923C", angle: 216 },
  10: { label: "CFF",        full: "Cash-Flow Forecasting",               color: "#C084FC", angle: 240 },
  11: { label: "RegTech",    full: "Regulatory Technology",                color: "#38BDF8", angle: 264 },
  12: { label: "Banking",    full: "Banking Solutions",                    color: "#4ADE80", angle: 288 },
  13: { label: "Insurance",  full: "Insurance Solutions",                  color: "#FB7185", angle: 312 },
  14: { label: "Other",      full: "Other Solutions",                      color: "#94A3B8", angle: 336 },
};

function polar(cx: number, cy: number, r: number, deg: number) {
  const rad = (deg - 90) * (Math.PI / 180);
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
  const [hovered, setHovered] = useState<string | null>(null);

  useEffect(() => {
    if (!initialData) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL || "https://treasurymapbackend-production.up.railway.app/api/v1"}/mapdata`)
        .then((r) => r.json())
        .then((d) => { setData(d); setLoading(false); })
        .catch(() => setLoading(false));
    }
  }, [initialData]);

  const filtered = useMemo(() => {
    return data.map((cat) => ({
      ...cat,
      logos: cat.logos.filter((logo) => {
        if (!logo.live) return false;
        if (searchQuery && !logo.keywords?.some((k) => k.toLowerCase().includes(searchQuery.toLowerCase()))) return false;
        if (hqFilter && !logo.headequarterLocation?.toLowerCase().includes(hqFilter.toLowerCase())) return false;
        return true;
      }),
    }));
  }, [data, searchQuery, hqFilter]);

  const total = filtered.reduce((a, c) => a + c.logos.length, 0);
  const toggle = useCallback((id: number) => setExpandedCat((p) => (p === id ? null : id)), []);

  // Canvas
  const W = 1600;
  const H = 1200;
  const CX = W / 2;
  const CY = H / 2;
  const ORBIT = 420;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[85vh] bg-[#05081A]">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 border-2 border-cyan-500/20 rounded-full animate-ping" />
            <div className="absolute inset-2 border-2 border-cyan-500/40 rounded-full animate-spin" style={{ animationDuration: "3s" }} />
            <div className="absolute inset-4 border border-cyan-400/60 rounded-full" />
          </div>
          <span className="text-sm text-gray-600 tracking-widest uppercase">Mapping...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#05081A] min-h-screen">
      {/* Search */}
      <div className="sticky top-16 z-30 bg-[#05081A]/80 backdrop-blur-2xl border-b border-white/[0.03]">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search companies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/[0.03] border border-white/[0.05] rounded-2xl pl-11 pr-4 py-3 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-cyan-500/20 focus:bg-white/[0.05] transition-all"
            />
          </div>
          <input
            type="text"
            placeholder="HQ location..."
            value={hqFilter}
            onChange={(e) => setHqFilter(e.target.value)}
            className="bg-white/[0.03] border border-white/[0.05] rounded-2xl px-5 py-3 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-cyan-500/20 transition-all w-44"
          />
          <div className="hidden sm:flex items-center gap-2 ml-auto">
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-xs text-gray-500">{total} companies</span>
          </div>
          {(searchQuery || hqFilter) && (
            <button onClick={() => { setSearchQuery(""); setHqFilter(""); }} className="text-xs text-gray-500 hover:text-gray-200 transition-colors">Clear</button>
          )}
        </div>
      </div>

      {/* Constellation */}
      <div className="flex justify-center px-2 py-2">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[1400px]" style={{ maxHeight: "calc(100vh - 120px)" }}>
          <defs>
            <radialGradient id="cg">
              <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.25" />
              <stop offset="40%" stopColor="#06B6D4" stopOpacity="0.04" />
              <stop offset="100%" stopColor="#06B6D4" stopOpacity="0" />
            </radialGradient>
            {Object.entries(CAT_META).map(([id, m]) => (
              <radialGradient key={id} id={`g${id}`}>
                <stop offset="0%" stopColor={m.color} stopOpacity="0.35" />
                <stop offset="100%" stopColor={m.color} stopOpacity="0" />
              </radialGradient>
            ))}
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Background orbit rings */}
          {[0.35, 0.55, 0.75, 1].map((scale, i) => (
            <circle key={i} cx={CX} cy={CY} r={ORBIT * scale} fill="none" stroke="white" strokeOpacity={0.015 + i * 0.005} strokeWidth="1" strokeDasharray={i === 0 ? "none" : `${2 + i * 2} ${6 + i * 4}`} />
          ))}

          {/* Connection lines: center → category */}
          {filtered.map((cat) => {
            const m = CAT_META[cat.id];
            if (!m || cat.logos.length === 0) return null;
            const p = polar(CX, CY, ORBIT, m.angle);
            const exp = expandedCat === cat.id;
            return (
              <line key={`l${cat.id}`} x1={CX} y1={CY} x2={p.x} y2={p.y}
                stroke={m.color} strokeOpacity={exp ? 0.25 : 0.06} strokeWidth={exp ? 1.5 : 0.7}
                className="transition-all duration-700" />
            );
          })}

          {/* Center glow + node */}
          <circle cx={CX} cy={CY} r={180} fill="url(#cg)" />
          <circle cx={CX} cy={CY} r={56} fill="#080D20" stroke="#06B6D4" strokeWidth="1" strokeOpacity="0.4" />
          <circle cx={CX} cy={CY} r={42} fill="#06B6D4" fillOpacity="0.06" />
          <text x={CX} y={CY - 8} textAnchor="middle" className="fill-cyan-400 text-[13px] font-bold" style={{ letterSpacing: "0.2em" }}>TREASURY</text>
          <text x={CX} y={CY + 10} textAnchor="middle" className="fill-cyan-400/50 text-[10px]" style={{ letterSpacing: "0.3em" }}>MAP</text>

          {/* Categories + logos */}
          {filtered.map((cat) => {
            const m = CAT_META[cat.id];
            if (!m || cat.logos.length === 0) return null;
            const cp = polar(CX, CY, ORBIT, m.angle);
            const exp = expandedCat === cat.id;
            const otherExp = expandedCat !== null && expandedCat !== cat.id;
            const nodeR = exp ? 48 : 36;
            const maxShow = exp ? 50 : 14;
            const logoR = exp ? Math.min(200, 80 + cat.logos.length * 3) : 120;
            const logos = cat.logos.slice(0, maxShow);
            const step = logos.length > 0 ? 360 / logos.length : 0;

            return (
              <g key={`c${cat.id}`} opacity={otherExp ? 0.08 : 1} className="transition-all duration-700">
                {/* Category glow */}
                <circle cx={cp.x} cy={cp.y} r={exp ? 160 : 70} fill={`url(#g${cat.id})`} className="transition-all duration-700" />

                {/* Logo connection lines */}
                {logos.map((logo, i) => {
                  const a = m.angle + (i - logos.length / 2) * (exp ? step * 0.9 : 6);
                  const lp = polar(cp.x, cp.y, logoR, a);
                  return (
                    <line key={`cl${cat.id}-${i}`}
                      x1={cp.x} y1={cp.y} x2={lp.x} y2={lp.y}
                      stroke={m.color} strokeOpacity={exp ? 0.12 : 0.03} strokeWidth="0.5"
                      className="transition-all duration-700" />
                  );
                })}

                {/* Logos */}
                {logos.map((logo, i) => {
                  const a = m.angle + (i - logos.length / 2) * (exp ? step * 0.9 : 6);
                  const tier = exp && i >= 25 ? 1 : 0;
                  const lp = polar(cp.x, cp.y, logoR + tier * 65, a);
                  const cid = logo.url?.match(/companyPage\/(\d+)/)?.[1];
                  const k = `${cat.id}-${i}`;
                  const h = hovered === k;
                  const sz = exp ? 56 : 44;
                  const szH = sz * 0.55;

                  if (lp.x < -80 || lp.x > W + 80 || lp.y < -80 || lp.y > H + 80) return null;

                  return (
                    <g key={k}>
                      <Link href={cid ? `/company/${cid}` : "#"} onMouseEnter={() => setHovered(k)} onMouseLeave={() => setHovered(null)}>
                        {/* Glow on hover */}
                        {h && <circle cx={lp.x} cy={lp.y} r={sz * 0.7} fill={m.color} fillOpacity="0.08" />}

                        {/* Logo image — no white bg, transparent circle container */}
                        <clipPath id={`clip-${k}`}>
                          <rect x={lp.x - sz / 2} y={lp.y - szH / 2} width={sz} height={szH} rx="8" />
                        </clipPath>

                        {/* Subtle border */}
                        <rect
                          x={lp.x - sz / 2} y={lp.y - szH / 2}
                          width={sz} height={szH} rx="8"
                          fill="white" fillOpacity={h ? "1" : "0.95"}
                          stroke={h ? m.color : "white"} strokeOpacity={h ? 0.6 : 0.08} strokeWidth={h ? 1.5 : 0.5}
                          className="transition-all duration-300"
                          filter={h ? "url(#glow)" : undefined}
                        />

                        {/* Image */}
                        <image
                          href={logo.image || ""}
                          x={lp.x - sz / 2 + 4} y={lp.y - szH / 2 + 3}
                          width={sz - 8} height={szH - 6}
                          preserveAspectRatio="xMidYMid meet"
                          clipPath={`url(#clip-${k})`}
                        />
                      </Link>

                      {/* Tooltip */}
                      {h && (
                        <g className="pointer-events-none">
                          <rect x={lp.x - 60} y={lp.y - szH / 2 - 32} width="120" height="24" rx="8" fill={m.color} fillOpacity="0.9" />
                          <text x={lp.x} y={lp.y - szH / 2 - 16} textAnchor="middle" className="fill-white text-[10px] font-medium">
                            {(logo.keywords?.[0] || "View").substring(0, 20)}
                          </text>
                          <polygon points={`${lp.x - 5},${lp.y - szH / 2 - 8} ${lp.x + 5},${lp.y - szH / 2 - 8} ${lp.x},${lp.y - szH / 2 - 2}`} fill={m.color} fillOpacity="0.9" />
                        </g>
                      )}
                    </g>
                  );
                })}

                {/* Category node */}
                <g className="cursor-pointer" onClick={() => toggle(cat.id)}>
                  <circle cx={cp.x} cy={cp.y} r={nodeR} fill="#080D20" stroke={m.color} strokeWidth={exp ? 2 : 1} strokeOpacity={exp ? 0.7 : 0.3} className="transition-all duration-500" />
                  <circle cx={cp.x} cy={cp.y} r={nodeR - 5} fill={m.color} fillOpacity={exp ? 0.12 : 0.06} className="transition-all duration-500" />
                  <text x={cp.x} y={cp.y - (exp ? 4 : 2)} textAnchor="middle" fill={m.color} className={exp ? "text-[12px] font-bold" : "text-[10px] font-semibold"} style={{ letterSpacing: "0.08em" }}>
                    {m.label}
                  </text>
                  <text x={cp.x} y={cp.y + (exp ? 12 : 10)} textAnchor="middle" fill="white" fillOpacity="0.25" className="text-[8px]">
                    {cat.logos.length}
                  </text>
                </g>

                {/* Overflow count */}
                {!exp && cat.logos.length > 14 && (
                  <text x={cp.x + nodeR + 12} y={cp.y + 4} fill={m.color} fillOpacity="0.35" className="text-[9px] cursor-pointer font-medium" onClick={() => toggle(cat.id)}>
                    +{cat.logos.length - 14}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Legend */}
      <div className="max-w-7xl mx-auto px-6 pb-12">
        <div className="flex flex-wrap justify-center gap-2">
          {Object.entries(CAT_META).map(([id, m]) => {
            const cat = filtered.find((c) => c.id === parseInt(id));
            if (!cat || cat.logos.length === 0) return null;
            const active = expandedCat === parseInt(id);
            return (
              <button key={id} onClick={() => toggle(parseInt(id))}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[11px] font-medium transition-all duration-300 ${
                  active ? "bg-white/[0.08] shadow-lg" : "text-gray-500 hover:text-gray-300 hover:bg-white/[0.03]"
                }`}
                style={active ? { color: m.color, boxShadow: `0 0 20px ${m.color}15` } : {}}
              >
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: m.color }} />
                {m.label}
                <span className="opacity-40 ml-1">{cat.logos.length}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

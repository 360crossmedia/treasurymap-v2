// MAP CORE — do not refactor without explicit instruction
"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import type { MapCategory } from "@/lib/api";

// Category zone positions on the 1200x776 map background (approximate from original site)
const ZONE_POSITIONS: Record<number, { x: number; y: number; w: number; h: number; label: string; fullName: string }> = {
  0:  { x: 0,    y: 0,   w: 180, h: 200, label: "TR",   fullName: "TR (Treasury Reporting)" },
  1:  { x: 140,  y: 0,   w: 200, h: 100, label: "eBAM", fullName: "eBAM (Electronic Bank Account Management)" },
  2:  { x: 260,  y: 0,   w: 160, h: 100, label: "BSG",  fullName: "BSG (Bank Single Gateway)" },
  3:  { x: 420,  y: 0,   w: 250, h: 200, label: "PSP",  fullName: "PSP (Payment Service Provider)" },
  4:  { x: 670,  y: 0,   w: 200, h: 160, label: "FIDP", fullName: "FIDP (Financial Instrument Dealing Platform)" },
  5:  { x: 870,  y: 0,   w: 170, h: 160, label: "FDF",  fullName: "FDF (Financial Data Feeding)" },
  6:  { x: 1040, y: 0,   w: 160, h: 160, label: "ETL",  fullName: "ETL (Extract Transform Load)" },
  7:  { x: 0,    y: 200, w: 300, h: 240, label: "CFF",  fullName: "CFF (Cash-Flow Forecasting)" },
  8:  { x: 300,  y: 150, w: 600, h: 250, label: "",      fullName: "Integrators & Consultants" },
  9:  { x: 900,  y: 160, w: 300, h: 200, label: "CMA",  fullName: "CMA (Currency Management Automation)" },
  10: { x: 0,    y: 440, w: 300, h: 200, label: "ERP",  fullName: "ERP" },
  11: { x: 300,  y: 440, w: 450, h: 200, label: "TMS",  fullName: "TMS / TRMS" },
  12: { x: 750,  y: 440, w: 220, h: 200, label: "FSC",  fullName: "FSC (Financial Supply Chain)" },
  13: { x: 970,  y: 440, w: 230, h: 200, label: "RegTech", fullName: "RegTech" },
  14: { x: 0,    y: 640, w: 1200, h: 136, label: "",     fullName: "Other Solutions" },
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
  const [hoveredLogo, setHoveredLogo] = useState<string | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);

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
          const matchUrl = logo.url?.toLowerCase().includes(q);
          if (!matchKeywords && !matchUrl) return false;
        }
        if (hqFilter && logo.headequarterLocation) {
          if (!logo.headequarterLocation.toLowerCase().includes(hqFilter.toLowerCase())) return false;
        }
        if (selectedCategory !== null && cat.id !== selectedCategory) return false;
        return true;
      }),
    }));
  }, [data, searchQuery, hqFilter, selectedCategory]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-50">
        <div className="animate-pulse text-gray-400">Loading map...</div>
      </div>
    );
  }

  return (
    <div className="map-container">
      {/* Filters bar */}
      <div className="bg-white border-b px-4 sm:px-6 py-4">
        <div className="max-w-[1400px] mx-auto flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 flex-1 min-w-[200px]">
            <span className="text-sm font-semibold text-gray-700">Keywords</span>
            <div className="relative flex-1">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Enter keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-[#1B4B6B] focus:ring-1 focus:ring-[#1B4B6B]"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-700">Category</span>
            <select
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1B4B6B]"
              value={selectedCategory ?? ""}
              onChange={(e) => setSelectedCategory(e.target.value ? parseInt(e.target.value) : null)}
            >
              <option value="">Select category</option>
              {data.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.categoryName}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-700">HQ</span>
            <input
              type="text"
              placeholder="Select headquarter location"
              value={hqFilter}
              onChange={(e) => setHqFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1B4B6B] min-w-[180px]"
            />
          </div>

          {(searchQuery || hqFilter || selectedCategory !== null) && (
            <button
              onClick={() => { setSearchQuery(""); setHqFilter(""); setSelectedCategory(null); }}
              className="px-3 py-2 rounded-lg text-sm text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-colors"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Map */}
      <div className="relative overflow-auto bg-[#e8f4f8]">
        <div
          ref={mapRef}
          className="relative mx-auto"
          style={{
            width: 1200,
            height: 776,
            backgroundImage: "url(/assets/map-bg.webp)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* Central text */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ top: "35%" }}>
            <Image
              src="/assets/central-text.png"
              alt="The Treasury Technology Landscape"
              width={700}
              height={80}
              className="opacity-80"
              unoptimized
            />
          </div>

          {/* Category zones with logos */}
          {filteredData.map((cat) => {
            const zone = ZONE_POSITIONS[cat.id];
            if (!zone) return null;
            const liveLogos = cat.logos;
            if (liveLogos.length === 0 && selectedCategory !== null) return null;

            return (
              <div
                key={cat.id}
                className="absolute"
                style={{ left: zone.x, top: zone.y, width: zone.w, height: zone.h }}
              >
                {/* Category title image */}
                <div className="absolute -top-1 left-0 z-10">
                  <Image
                    src={cat.categoryImage || `/assets/cat-category-${cat.id + 1}.png`}
                    alt={zone.fullName}
                    width={zone.w}
                    height={40}
                    className="object-contain object-left max-h-[50px]"
                    unoptimized
                  />
                </div>

                {/* Logos grid within the zone */}
                <div className="absolute top-[45px] left-0 right-0 bottom-0 flex flex-wrap content-start gap-[2px] p-1">
                  {liveLogos.map((logo, i) => {
                    const companyId = logo.url?.match(/companyPage\/(\d+)/)?.[1];
                    const logoKey = `${cat.id}-${i}`;
                    return (
                      <Link
                        key={logoKey}
                        href={companyId ? `/company/${companyId}` : "#"}
                        className="relative group"
                        onMouseEnter={() => setHoveredLogo(logoKey)}
                        onMouseLeave={() => setHoveredLogo(null)}
                      >
                        <div className="w-[48px] h-[28px] bg-white rounded-[3px] flex items-center justify-center shadow-sm hover:shadow-md hover:scale-110 transition-all border border-white/50">
                          {logo.image ? (
                            <Image
                              src={logo.image}
                              alt=""
                              width={44}
                              height={24}
                              className="object-contain max-h-[22px]"
                              unoptimized
                            />
                          ) : (
                            <span className="text-[6px] text-gray-400">N/A</span>
                          )}
                        </div>
                        {/* Tooltip */}
                        {hoveredLogo === logoKey && (
                          <div className="absolute z-50 -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap pointer-events-none">
                            {logo.keywords?.[0] || "Company"}
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
      </div>
    </div>
  );
}

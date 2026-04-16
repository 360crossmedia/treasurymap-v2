// MAP CORE — do not refactor without explicit instruction
"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import type { MapCategory } from "@/lib/api";

interface MapContainerProps {
  initialData?: MapCategory[];
}

export function MapContainer({ initialData }: MapContainerProps) {
  const [data, setData] = useState<MapCategory[]>(initialData || []);
  const [loading, setLoading] = useState(!initialData);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [hqFilter, setHqFilter] = useState("");

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
        return true;
      }),
    }));
  }, [data, searchQuery, hqFilter]);

  const categoryNames: Record<number, string> = {
    0: "FIDP", 1: "FDF", 2: "CMA", 3: "Integrators", 4: "OTS",
    5: "TMS / TRMS", 6: "BI & Analytics", 7: "ERP", 8: "ETL",
    9: "FSC", 10: "CFF", 11: "RegTech", 12: "Banking", 13: "Insurance", 14: "Other",
  };

  const categoryDescriptions: Record<number, string> = {
    0: "Financial Instrument Dealing Platform",
    1: "Financial Data Feeding",
    2: "Currency Management Automation",
    3: "System Integrators & Consultants",
    4: "Other Treasury Solutions",
    5: "Treasury Management Systems",
    6: "Business Intelligence & Analytics",
    7: "Enterprise Resource Planning",
    8: "Extract, Transform, Load",
    9: "Financial Supply Chain",
    10: "Cash Flow Forecasting",
    11: "Regulatory Technology",
    12: "Banking Solutions",
    13: "Insurance Solutions",
    14: "Other Solutions",
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-pulse text-[#94A3B8]">Loading map data...</div>
      </div>
    );
  }

  return (
    <div className="map-container">
      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-[200px]">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search by company name or keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#1A2332] border border-[#1E293B] rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder-[#64748B] focus:outline-none focus:border-[#6C5CE7] transition-colors"
          />
        </div>
        <input
          type="text"
          placeholder="Filter by HQ location..."
          value={hqFilter}
          onChange={(e) => setHqFilter(e.target.value)}
          className="bg-[#1A2332] border border-[#1E293B] rounded-lg px-4 py-2.5 text-sm text-white placeholder-[#64748B] focus:outline-none focus:border-[#6C5CE7] transition-colors min-w-[180px]"
        />
        {(searchQuery || hqFilter || selectedCategory !== null) && (
          <button
            onClick={() => { setSearchQuery(""); setHqFilter(""); setSelectedCategory(null); }}
            className="px-4 py-2.5 rounded-lg bg-[#1E293B] text-[#94A3B8] text-sm hover:bg-[#334155] transition-colors"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Category pills */}
      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
            selectedCategory === null
              ? "bg-[#6C5CE7] text-white"
              : "bg-[#1A2332] text-[#94A3B8] hover:bg-[#1E293B]"
          }`}
        >
          All ({filteredData.reduce((a, c) => a + c.logos.length, 0)})
        </button>
        {filteredData.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              selectedCategory === cat.id
                ? "bg-[#6C5CE7] text-white"
                : "bg-[#1A2332] text-[#94A3B8] hover:bg-[#1E293B]"
            }`}
          >
            {categoryNames[cat.id] || cat.categoryName} ({cat.logos.length})
          </button>
        ))}
      </div>

      {/* Category grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredData
          .filter((cat) => selectedCategory === null || cat.id === selectedCategory)
          .filter((cat) => cat.logos.length > 0)
          .map((cat) => (
            <div
              key={cat.id}
              className="bg-[#1A2332] border border-[#1E293B] rounded-xl overflow-hidden hover:border-[#334155] transition-all"
            >
              {/* Category header */}
              <div className="px-5 py-4 border-b border-[#1E293B] flex items-center gap-3">
                {cat.categoryImage ? (
                  <Image
                    src={cat.categoryImage}
                    alt={`${categoryNames[cat.id] || cat.categoryName} category`}
                    width={40}
                    height={40}
                    className="rounded-lg object-contain"
                    unoptimized
                  />
                ) : (
                  <div className="w-10 h-10 rounded-lg bg-[#6C5CE7]/20 flex items-center justify-center">
                    <span className="text-[#6C5CE7] font-bold text-xs">
                      {(categoryNames[cat.id] || "?").slice(0, 3)}
                    </span>
                  </div>
                )}
                <div>
                  <h3 className="text-sm font-semibold text-white">
                    {categoryNames[cat.id] || cat.categoryName}
                  </h3>
                  <p className="text-[11px] text-[#64748B]">
                    {categoryDescriptions[cat.id] || ""} · {cat.logos.length} companies
                  </p>
                </div>
              </div>

              {/* Logos grid */}
              <div className="p-4 grid grid-cols-4 sm:grid-cols-5 gap-2">
                {cat.logos.slice(0, 15).map((logo, i) => {
                  const companyId = logo.url?.match(/companyPage\/(\d+)/)?.[1];
                  return (
                    <Link
                      key={i}
                      href={companyId ? `/company/${companyId}` : "#"}
                      className="group"
                    >
                      <div className="aspect-square bg-white rounded-lg p-1.5 flex items-center justify-center hover:ring-2 hover:ring-[#6C5CE7] transition-all">
                        {logo.image ? (
                          <Image
                            src={logo.image}
                            alt=""
                            width={48}
                            height={48}
                            className="object-contain max-h-full"
                            unoptimized
                          />
                        ) : (
                          <div className="w-full h-full bg-[#F1F5F9] rounded flex items-center justify-center">
                            <span className="text-[8px] text-[#64748B] font-medium">N/A</span>
                          </div>
                        )}
                      </div>
                    </Link>
                  );
                })}
                {cat.logos.length > 15 && (
                  <div className="aspect-square bg-[#0F172A] rounded-lg flex items-center justify-center">
                    <span className="text-xs text-[#6C5CE7] font-medium">+{cat.logos.length - 15}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

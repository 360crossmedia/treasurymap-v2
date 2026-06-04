"use client";
import { useState, useCallback, useEffect } from "react";
import Navbar from "../Navbar";
import Footer from "../Footer";
import ProceduralMap from "./ProceduralMap";
import ProceduralMapFilters from "./ProceduralMapFilters";
import { CAT_META } from "./catMeta";

const TOTAL_CATS = Object.keys(CAT_META).length;
const CODE_TO_ID = Object.fromEntries(
  Object.entries(CAT_META).map(([key, v]) => [v.code, parseInt(key.split("-")[1])])
);

// Shared map page body, used by both the homepage ("Treasury Map", 1 logo/vendor)
// and /multiplayer-map ("Multiplayer Map", vendor repeated across every category).
export default function MapExperience({ multiplayer = false }) {
  const [filters, setFilters] = useState({});
  const [vendors, setVendors] = useState([]);
  const [filterOpts, setFilterOpts] = useState({ subCategories: [], countries: [] });
  const [matchCount, setMatchCount] = useState(null); // null = no filters

  // ?category=CODE deep-link
  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get("category");
    if (code && Object.values(CAT_META).some((v) => v.code === code)) {
      const meta = Object.values(CAT_META).find((v) => v.code === code);
      setFilters({ category: { type: "category", code, label: code, hue: meta?.hue } });
    }
  }, []);

  const addFilter = useCallback((filter) => {
    setFilters((f) => ({ ...f, [filter.type]: filter }));
  }, []);

  const removeFilter = useCallback((type) => {
    setFilters((f) => { const n = { ...f }; delete n[type]; return n; });
  }, []);

  const handleClear = useCallback(() => setFilters({}), []);

  const handleCategoryClick = useCallback((code) => {
    setFilters((f) => {
      if (f.category?.code === code) { const n = { ...f }; delete n.category; return n; }
      const meta = Object.values(CAT_META).find((v) => v.code === code);
      return { ...f, category: { type: "category", code, label: code, hue: meta?.hue } };
    });
  }, []);

  // Live total of unique vendors currently on this map (varies by mode).
  const totalVendors = vendors.length || 0;

  const catFilter = filters.category;
  const activeMeta = catFilter ? Object.values(CAT_META).find((v) => v.code === catFilter.code) : null;

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Chivo:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&family=Oswald:wght@300;400;500;600;700&display=swap"
        rel="stylesheet"
      />
      <Navbar buttonLabel="Log In" />
      <ProceduralMapFilters
        filters={filters}
        onAddFilter={addFilter}
        onRemoveFilter={removeFilter}
        onClear={handleClear}
        vendors={vendors}
        subCategories={filterOpts.subCategories}
        countries={filterOpts.countries}
        matchCount={matchCount}
        totalVendors={totalVendors}
        totalCats={TOTAL_CATS}
      />
      <div style={{ position: "relative" }}>
        <ProceduralMap
          multiplayer={multiplayer}
          filters={filters}
          onCategoryClick={handleCategoryClick}
          onClear={handleClear}
          onVendors={setVendors}
          onFilterOptions={setFilterOpts}
          onMatchCount={setMatchCount}
        />

        {/* Compare bar — when a category filter is active */}
        {activeMeta && (
          <div style={{
            position: "fixed", bottom: 28, left: "50%", transform: "translateX(-50%)",
            display: "flex", alignItems: "center", gap: 14,
            background: "rgba(255,255,255,0.97)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
            border: `1.5px solid hsl(${activeMeta.hue},55%,80%)`, borderRadius: 100, padding: "12px 20px 12px 18px",
            boxShadow: `0 8px 32px -8px rgba(10,26,51,.25), 0 0 0 4px hsl(${activeMeta.hue},70%,93%)`,
            zIndex: 200, whiteSpace: "nowrap",
          }}>
            <span style={{
              width: 10, height: 10, borderRadius: "50%", flexShrink: 0,
              background: `hsl(${activeMeta.hue},72%,50%)`, boxShadow: `0 0 8px hsl(${activeMeta.hue},72%,60%)`, display: "inline-block",
            }} />
            <span style={{ fontSize: 14, fontWeight: 700, color: "#0e2c5c" }}>{catFilter.code}</span>
            <span style={{ fontSize: 13, color: "#5a6a85" }}>· Compare vendors in this category</span>
            <a href="/compare-tools"
              onClick={() => sessionStorage.setItem("comparePreCategoryId", CODE_TO_ID[catFilter.code])}
              style={{
                display: "inline-flex", alignItems: "center", gap: 7,
                background: `linear-gradient(135deg,hsl(${activeMeta.hue},80%,55%),hsl(${activeMeta.hue},65%,38%))`,
                color: "#fff", padding: "9px 18px", borderRadius: 100, fontWeight: 600, fontSize: 13.5,
                textDecoration: "none", boxShadow: `0 4px 14px -4px hsl(${activeMeta.hue},65%,40%)`,
              }}>
              Compare →
            </a>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}

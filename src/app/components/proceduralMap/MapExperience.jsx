"use client";
import { useState, useCallback, useEffect } from "react";
import Navbar from "../Navbar";
import Footer from "../Footer";
import ProceduralMap from "./ProceduralMap";
import ProceduralMapFilters from "./ProceduralMapFilters";
import CategoryPanel from "./CategoryPanel";
import { CAT_META } from "./catMeta";

const TOTAL_CATS = Object.keys(CAT_META).length;
const CODE_TO_ID = Object.fromEntries(
  Object.entries(CAT_META).map(([key, v]) => [v.code, parseInt(key.split("-")[1])])
);

// Shared map page body, used by both the homepage ("Treasury Map", 1 logo/vendor)
// and /multiplayer-map ("Multiplayer Map", vendor repeated across every category).
export default function MapExperience({ multiplayer = false }) {
  const [filters, setFilters] = useState({});         // single-value facets: category / keyword / active
  const [subs, setSubs] = useState([]);               // multi-select sub-categories [{value,label}]
  const [vendors, setVendors] = useState([]);
  const [cats, setCats] = useState([]);               // full per-category vendor lists
  const [drillCode, setDrillCode] = useState(null);   // category drill-down panel
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

  // Multi-select sub-categories (OR within the facet)
  const toggleSub = useCallback((sub) => {
    setSubs((s) => (s.some((x) => String(x.value) === String(sub.value))
      ? s.filter((x) => String(x.value) !== String(sub.value))
      : [...s, sub]));
  }, []);
  const removeSub = useCallback((value) => {
    setSubs((s) => s.filter((x) => String(x.value) !== String(value)));
  }, []);

  const handleClear = useCallback(() => { setFilters({}); setSubs([]); }, []);

  // Clicking a category LABEL on the map opens the full drill-down panel
  // (shows every vendor of that category). The filter dropdown is separate
  // and keeps dimming the map for combinable filters.
  const handleCategoryClick = useCallback((code) => {
    setDrillCode((cur) => (cur === code ? null : code));
  }, []);

  // Live total of unique vendors currently on this map (varies by mode).
  const totalVendors = vendors.length || 0;

  const catFilter = filters.category;
  const activeMeta = catFilter ? Object.values(CAT_META).find((v) => v.code === catFilter.code) : null;

  // Drill-down panel (full category grid) — from clicking a category label.
  const drillCat = drillCode ? cats.find((c) => c.code === drillCode) : null;
  const drillId = drillCode ? CODE_TO_ID[drillCode] : null;

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Chivo:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&family=Oswald:wght@300;400;500;600;700&display=swap"
        rel="stylesheet"
      />
      <Navbar buttonLabel="Log In" />
      <ProceduralMapFilters
        filters={filters}
        subs={subs}
        onAddFilter={addFilter}
        onRemoveFilter={removeFilter}
        onToggleSub={toggleSub}
        onRemoveSub={removeSub}
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
          subs={subs}
          onCategoryClick={handleCategoryClick}
          onClear={handleClear}
          onVendors={setVendors}
          onCats={setCats}
          onFilterOptions={setFilterOpts}
          onMatchCount={setMatchCount}
        />

        {/* Category drill-down — full grid of every vendor in the clicked category */}
        {drillCat && (
          <CategoryPanel cat={drillCat} categoryId={drillId} onClose={() => setDrillCode(null)} />
        )}

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

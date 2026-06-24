"use client";
import { useState, useCallback, useEffect } from "react";
import Navbar from "../Navbar";
import Footer from "../Footer";
import ProceduralMap from "./ProceduralMap";
import ProceduralMapFilters from "./ProceduralMapFilters";
import CategoryPanel from "./CategoryPanel";
import HomeIntro from "./HomeIntro";
import { CAT_META } from "./catMeta";

const TOTAL_CATS = Object.keys(CAT_META).length;
const CODE_TO_ID = Object.fromEntries(
  Object.entries(CAT_META).map(([key, v]) => [v.code, parseInt(key.split("-")[1])])
);

// Shared map page body, used by both the homepage ("Treasury Map", 1 logo/vendor)
// and /multiplayer-map ("Multiplayer Map", vendor repeated across every category).
export default function MapExperience({ multiplayer = false, seoSection = null }) {
  const [filters, setFilters] = useState({});         // single-value facets: keyword / active
  const [catSels, setCatSels] = useState([]);         // multi-select categories [{code,hue,label}]
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
      setCatSels([{ code, label: code, hue: meta?.hue }]);
    }
  }, []);

  const addFilter = useCallback((filter) => {
    setFilters((f) => ({ ...f, [filter.type]: filter }));
  }, []);

  const removeFilter = useCallback((type) => {
    setFilters((f) => { const n = { ...f }; delete n[type]; return n; });
  }, []);

  // Multi-select categories (OR within the facet)
  const toggleCat = useCallback((cat) => {
    setCatSels((s) => (s.some((x) => x.code === cat.code)
      ? s.filter((x) => x.code !== cat.code)
      : [...s, cat]));
  }, []);
  const removeCat = useCallback((code) => {
    setCatSels((s) => s.filter((x) => x.code !== code));
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

  const handleClear = useCallback(() => { setFilters({}); setCatSels([]); setSubs([]); }, []);

  // Clicking a category LABEL on the map opens the full drill-down panel
  // (shows every vendor of that category). The filter dropdown is separate
  // and keeps dimming the map for combinable filters.
  const handleCategoryClick = useCallback((code) => {
    setDrillCode((cur) => (cur === code ? null : code));
  }, []);

  // Live total of unique vendors currently on this map (varies by mode).
  const totalVendors = vendors.length || 0;

  // Drill-down panel (full category grid) · from clicking a category label.
  const drillCat = drillCode ? cats.find((c) => c.code === drillCode) : null;
  const drillId = drillCode ? CODE_TO_ID[drillCode] : null;

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Chivo:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&family=Oswald:wght@300;400;500;600;700&display=swap"
        rel="stylesheet"
      />
      <Navbar buttonLabel="Log In" />
      {/* Onboarding strip · homepage only (not the /multiplayer-map view). */}
      {!multiplayer && <HomeIntro />}
      <ProceduralMapFilters
        filters={filters}
        catSels={catSels}
        subs={subs}
        onAddFilter={addFilter}
        onRemoveFilter={removeFilter}
        onToggleCat={toggleCat}
        onRemoveCat={removeCat}
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
          catSels={catSels}
          subs={subs}
          onCategoryClick={handleCategoryClick}
          onClear={handleClear}
          onVendors={setVendors}
          onCats={setCats}
          onFilterOptions={setFilterOpts}
          onMatchCount={setMatchCount}
        />

        {/* Category drill-down · full grid of every vendor in the clicked category */}
        {drillCat && (
          <CategoryPanel cat={drillCat} categoryId={drillId} onClose={() => setDrillCode(null)} />
        )}
      </div>
      {/* Server-rendered SEO section (categories + providers) · homepage only. */}
      {!multiplayer && seoSection}
      <Footer />
    </>
  );
}

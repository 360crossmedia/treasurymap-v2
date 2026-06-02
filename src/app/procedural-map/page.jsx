"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProceduralMap from "../components/proceduralMap/ProceduralMap";
import ProceduralMapFilters from "../components/proceduralMap/ProceduralMapFilters";
import { CAT_META } from "../components/proceduralMap/catMeta";

const TOTAL_VENDORS = 307;
const TOTAL_CATS    = Object.keys(CAT_META).length;
const CODE_TO_ID    = Object.fromEntries(
  Object.entries(CAT_META).map(([key, v]) => [v.code, parseInt(key.split("-")[1])])
);

export default function ProceduralMapPreviewPage() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState(null);
  const [vendorCount,  setVendorCount]  = useState(TOTAL_VENDORS);
  const [catCount,     setCatCount]     = useState(TOTAL_CATS);

  // D1: read URL params on mount WITHOUT useSearchParams (avoids Suspense requirement)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const cat = params.get("category");
    const q   = params.get("q");
    if (cat) {
      const meta = Object.entries(CAT_META).find(([, v]) => v.code === cat);
      if (meta) setActiveFilter({ type: "category", code: cat });
    } else if (q) {
      setActiveFilter({ type: "keyword", value: q });
    }
  }, []);

  const pushURL = useCallback((filter) => {
    const params = new URLSearchParams();
    if (filter?.type === "category") params.set("category", filter.code);
    if (filter?.type === "keyword"  && filter.value) params.set("q", filter.value);
    const qs = params.toString();
    router.replace(`/procedural-map${qs ? "?" + qs : ""}`, { scroll: false });
  }, [router]);

  const handleFilter = useCallback((filter) => {
    setActiveFilter(filter);
    pushURL(filter);
    if (filter?.type === "category") setCatCount(1);
    else { setVendorCount(null); setCatCount(null); }
  }, [pushURL]);

  const handleClear = useCallback(() => {
    setActiveFilter(null);
    setVendorCount(TOTAL_VENDORS);
    setCatCount(TOTAL_CATS);
    router.replace("/procedural-map", { scroll: false });
  }, [router]);

  // A2: label click on map — toggle category filter
  const handleCategoryClick = useCallback((code) => {
    if (activeFilter?.type === "category" && activeFilter.code === code) {
      handleClear();
    } else {
      const filter = { type: "category", code };
      setActiveFilter(filter);
      pushURL(filter);
      setCatCount(1);
    }
  }, [activeFilter, handleClear, pushURL]);

  const activeMeta = activeFilter?.type === "category"
    ? Object.values(CAT_META).find(v => v.code === activeFilter.code)
    : null;

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Chivo:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&family=Oswald:wght@300;400;500;600;700&display=swap"
        rel="stylesheet"
      />
      <Navbar buttonLabel="Log In" />
      <ProceduralMapFilters
        onFilter={handleFilter}
        onClear={handleClear}
        activeFilter={activeFilter}
        vendorCount={vendorCount}
        catCount={catCount}
      />
      <div style={{ position: "relative" }}>
        <ProceduralMap
          activeFilter={activeFilter}
          onCategoryClick={handleCategoryClick}
          onClear={handleClear}
          vendorCount={vendorCount}
        />

        {/* Option D — Compare bar */}
        {activeMeta && (
          <div style={{
            position: "fixed", bottom: 28, left: "50%",
            transform: "translateX(-50%)",
            display: "flex", alignItems: "center", gap: 14,
            background: "rgba(255,255,255,0.97)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            border: `1.5px solid hsl(${activeMeta.hue},55%,80%)`,
            borderRadius: 100, padding: "12px 20px 12px 18px",
            boxShadow: `0 8px 32px -8px rgba(10,26,51,.25), 0 0 0 4px hsl(${activeMeta.hue},70%,93%)`,
            zIndex: 200,
            whiteSpace: "nowrap",
          }}>
            <span style={{
              width: 10, height: 10, borderRadius: "50%", flexShrink: 0,
              background: `hsl(${activeMeta.hue},72%,50%)`,
              boxShadow: `0 0 8px hsl(${activeMeta.hue},72%,60%)`,
              display: "inline-block",
            }} />
            <span style={{ fontSize: 14, fontWeight: 700, color: "#0e2c5c" }}>
              {activeFilter.code}
            </span>
            <span style={{ fontSize: 13, color: "#5a6a85" }}>
              · Compare vendors in this category
            </span>
            <a
              href="/compare-tools"
              onClick={() => sessionStorage.setItem("comparePreCategoryId", CODE_TO_ID[activeFilter.code])}
              style={{
                display: "inline-flex", alignItems: "center", gap: 7,
                background: `linear-gradient(135deg,hsl(${activeMeta.hue},80%,55%),hsl(${activeMeta.hue},65%,38%))`,
                color: "#fff", padding: "9px 18px", borderRadius: 100,
                fontWeight: 600, fontSize: 13.5, textDecoration: "none",
                boxShadow: `0 4px 14px -4px hsl(${activeMeta.hue},65%,40%)`,
              }}
            >
              Compare →
            </a>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}

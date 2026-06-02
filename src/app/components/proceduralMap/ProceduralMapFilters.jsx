"use client";
import { useState, useRef, useCallback } from "react";
import { CAT_META } from "./catMeta";

const CATEGORIES = Object.entries(CAT_META)
  .map(([key, v]) => ({ key, label: `${v.code} (${v.full})`, code: v.code, hue: v.hue, n: parseInt(key.split("-")[1]) }))
  .sort((a, b) => a.n - b.n);

const IconSearch = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="7"/><path d="M21 21l-4-4"/>
  </svg>
);

const IconGrid = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
    <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
  </svg>
);

const IconChevron = ({ open, color }) => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
    stroke={color || "currentColor"} strokeWidth="2.4"
    style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform .2s", flexShrink: 0 }}>
    <path d="M6 9l6 6 6-6"/>
  </svg>
);

export default function ProceduralMapFilters({ onFilter, onClear, activeFilter, vendorCount, catCount }) {
  const [keyword, setKeyword] = useState("");
  const [catOpen, setCatOpen] = useState(false);
  const debounceRef = useRef(null);

  const activeCat = activeFilter?.type === "category"
    ? CATEGORIES.find(c => c.code === activeFilter.code)
    : null;

  // B3: debounced keyword
  const handleKeyword = useCallback((e) => {
    const val = e.target.value;
    setKeyword(val);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => onFilter({ type: "keyword", value: val }), 250);
  }, [onFilter]);

  const handleCategory = (cat) => {
    setCatOpen(false);
    if (activeFilter?.type === "category" && activeFilter.code === cat.code) { handleClear(); return; }
    onFilter({ type: "category", key: cat.key, code: cat.code });
  };

  const handleClear = () => {
    setKeyword("");
    setCatOpen(false);
    clearTimeout(debounceRef.current);
    onClear();
  };

  const hasFilter = !!(keyword || activeCat);

  return (
    <div className="pmf-bar">
      {/* Keywords pill */}
      <div className="pmf-pill-wrap">
        <div className="pmf-pill">
          <span className="pmf-icon"><IconSearch /></span>
          <input
            className="pmf-input"
            placeholder="Enter keyword…"
            value={keyword}
            onChange={handleKeyword}
          />
          {keyword && (
            <button className="pmf-pill-clear" onClick={() => { setKeyword(""); onFilter({ type: "keyword", value: "" }); }}>✕</button>
          )}
        </div>
      </div>

      {/* Category pill + dropdown */}
      <div className="pmf-pill-wrap" style={{ position: "relative" }}>
        {activeCat ? (
          /* Active category chip */
          <div className="pmf-chip" style={{
            background: `hsl(${activeCat.hue},70%,93%)`,
            color: `hsl(${activeCat.hue},60%,28%)`,
            borderColor: `hsl(${activeCat.hue},55%,78%)`,
          }}>
            <span className="pmf-chip-dot" style={{ background: `hsl(${activeCat.hue},72%,50%)` }} />
            <span className="pmf-chip-label">{activeCat.code}</span>
            <button className="pmf-chip-x" style={{ color: `hsl(${activeCat.hue},55%,40%)` }}
              onClick={handleClear}>✕</button>
          </div>
        ) : (
          <div className="pmf-pill pmf-pill-select" onClick={() => setCatOpen(!catOpen)}>
            <span className="pmf-icon" style={{ color: "#3a4a66" }}><IconGrid /></span>
            <span className="pmf-placeholder">Select category</span>
            <IconChevron open={catOpen} />
          </div>
        )}

        {catOpen && (
          <div className="pmf-dropdown">
            <div className="pmf-dropdown-header">Categories</div>
            {CATEGORIES.map(c => (
              <div
                key={c.key}
                className={`pmf-option ${activeCat?.code === c.code ? "pmf-option-active" : ""}`}
                style={activeCat?.code === c.code ? {
                  background: `hsl(${c.hue},70%,93%)`,
                  color: `hsl(${c.hue},60%,28%)`,
                } : {}}
                onClick={() => handleCategory(c)}
              >
                <span className="pmf-dot" style={{ background: `hsl(${c.hue},72%,50%)`, boxShadow: `0 0 6px hsl(${c.hue},72%,60%)` }} />
                <span className="pmf-option-code">{c.code}</span>
                <span className="pmf-option-full">{c.label.replace(c.code + " ", "")}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Right side: counter + clear */}
      <div className="pmf-right">
        {!hasFilter && vendorCount > 0 && (
          <div className="pmf-counter">
            <span className="pmf-counter-n">{vendorCount}</span>
            <span className="pmf-counter-sep">|</span>
            <span className="pmf-counter-lbl">{catCount || 14} categories</span>
          </div>
        )}
        {hasFilter && (
          <button className="pmf-clear-btn" onClick={handleClear} title="Clear filters (Esc)">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        )}
      </div>

      <style jsx>{`
        .pmf-bar {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 38px;
          background: rgba(255,255,255,0.92);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-bottom: 1px solid #E1E7F1;
          flex-wrap: wrap;
          position: relative;
          z-index: 40;
        }

        /* ── Pill wrapper ── */
        .pmf-pill-wrap { display: flex; align-items: center; }

        .pmf-pill {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #F4F7FC;
          border: 1.5px solid transparent;
          border-radius: 100px;
          padding: 8px 16px;
          min-width: 180px;
          cursor: text;
          transition: border-color .2s, box-shadow .2s;
        }
        .pmf-pill:focus-within {
          border-color: #2f6fe0;
          box-shadow: 0 0 0 3px rgba(47,111,224,.1);
          background: #fff;
        }
        .pmf-pill-select {
          cursor: pointer;
          min-width: 180px;
          user-select: none;
          justify-content: space-between;
        }
        .pmf-pill-select:hover { border-color: #adc0dc; }

        .pmf-icon { color: #8a93a6; display: flex; align-items: center; flex-shrink: 0; }

        .pmf-input {
          border: none; outline: none; background: transparent;
          font-size: 13.5px; color: #0A1A33; width: 160px;
          font-family: inherit;
        }
        .pmf-input::placeholder { color: #9aa3b5; }

        .pmf-placeholder { font-size: 13.5px; color: #9aa3b5; flex: 1; }

        .pmf-pill-clear {
          background: none; border: none; cursor: pointer;
          color: #9aa3b5; font-size: 12px; padding: 0; line-height: 1;
          transition: color .15s; flex-shrink: 0;
        }
        .pmf-pill-clear:hover { color: #3a4a66; }

        /* ── Active category chip ── */
        .pmf-chip {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          border: 1.5px solid;
          border-radius: 100px;
          padding: 7px 14px 7px 10px;
          font-size: 13.5px;
          font-weight: 600;
          cursor: default;
          animation: chipIn .18s ease;
        }
        @keyframes chipIn { from { transform: scale(.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .pmf-chip-dot {
          width: 9px; height: 9px; border-radius: 50%; flex-shrink: 0;
        }
        .pmf-chip-label { font-size: 13.5px; font-weight: 700; letter-spacing: .02em; }
        .pmf-chip-x {
          background: none; border: none; cursor: pointer; font-size: 11px;
          padding: 0; line-height: 1; margin-left: 2px; opacity: .7;
          transition: opacity .15s;
        }
        .pmf-chip-x:hover { opacity: 1; }

        /* ── Dropdown ── */
        .pmf-dropdown {
          position: absolute;
          top: calc(100% + 6px); left: 0;
          min-width: 300px;
          background: #fff;
          border: 1px solid #E1E7F1;
          border-radius: 14px;
          box-shadow: 0 16px 48px -8px rgba(10,26,51,.18);
          z-index: 200;
          max-height: 320px;
          overflow-y: auto;
          animation: dropIn .16s ease;
        }
        @keyframes dropIn { from { transform: translateY(-6px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .pmf-dropdown-header {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px; text-transform: uppercase; letter-spacing: .1em;
          color: #9aa3b5; padding: 10px 16px 6px; font-weight: 600;
        }
        .pmf-option {
          display: flex; align-items: center; gap: 10px;
          padding: 9px 16px; cursor: pointer;
          border-bottom: 1px solid #f4f7fc;
          transition: background .1s;
        }
        .pmf-option:last-child { border-bottom: none; }
        .pmf-option:hover { background: #f7f9ff; }
        .pmf-dot {
          width: 9px; height: 9px; border-radius: 50%; flex-shrink: 0;
        }
        .pmf-option-code {
          font-weight: 700; font-size: 13px; color: #0e2c5c;
          min-width: 44px; font-family: 'Oswald', sans-serif;
        }
        .pmf-option-full {
          font-size: 12px; color: #5a6a85;
          overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
        }

        /* ── Right: counter + clear ── */
        .pmf-right {
          margin-left: auto;
          display: flex; align-items: center; gap: 10px;
        }
        .pmf-counter {
          display: flex; align-items: center; gap: 7px;
          font-family: 'JetBrains Mono', monospace;
        }
        .pmf-counter-n {
          font-size: 17px; font-weight: 700; color: #2f6fe0; line-height: 1;
        }
        .pmf-counter-sep { color: #D0D8E8; font-size: 14px; }
        .pmf-counter-lbl {
          font-size: 11px; color: #8a93a6;
          text-transform: uppercase; letter-spacing: .06em;
        }
        .pmf-clear-btn {
          display: flex; align-items: center; justify-content: center;
          width: 30px; height: 30px; border-radius: 50%;
          background: #F4F7FC; border: 1.5px solid #E1E7F1;
          color: #626b80; cursor: pointer;
          transition: background .2s, border-color .2s, color .2s;
        }
        .pmf-clear-btn:hover {
          background: #fee; border-color: #f5a0a0; color: #cc0000;
        }
      `}</style>
    </div>
  );
}

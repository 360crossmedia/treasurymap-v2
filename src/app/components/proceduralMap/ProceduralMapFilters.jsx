"use client";
import { useState, useRef, useCallback, useEffect } from "react";
import { CAT_META } from "./catMeta";

const CATEGORIES = Object.entries(CAT_META)
  .map(([key, v]) => ({ key, label: `${v.code} (${v.full})`, code: v.code, hue: v.hue, n: parseInt(key.split("-")[1]) }))
  .sort((a, b) => a.n - b.n);

const IconSearch = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4-4" /></svg>
);
const IconChevron = ({ open }) => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"
    style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform .2s", flexShrink: 0 }}><path d="M6 9l6 6 6-6" /></svg>
);

// Generic dropdown (searchable when the option list is long)
function Dropdown({ label, placeholder, options, activeId, onPick }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const ref = useRef(null);
  const active = options.find((o) => String(o.id) === String(activeId));
  const searchable = options.length > 12;
  const shown = q.trim()
    ? options.filter((o) => o.name.toLowerCase().includes(q.toLowerCase().trim()))
    : options;
  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) { setOpen(false); setQ(""); } };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  return (
    <div className="pf-col" ref={ref}>
      <label className="pf-label">{label}</label>
      <div className={`pf-ctl pf-select ${active ? "pf-active" : ""}`} onClick={() => setOpen(!open)}>
        <span style={{ color: active ? "#2f6fe0" : "#9aa3b5", fontWeight: active ? 600 : 400, fontSize: 13, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 150 }}>
          {active ? active.name : placeholder}
        </span>
        <IconChevron open={open} />
      </div>
      {open && (
        <div className="pf-dropdown">
          {searchable && (
            <input className="pf-search" autoFocus placeholder="Search…" value={q}
              onChange={(e) => setQ(e.target.value)} onClick={(e) => e.stopPropagation()} />
          )}
          <div className="pf-option" style={{ color: "#9aa3b5" }} onClick={() => { onPick(null); setOpen(false); setQ(""); }}>All</div>
          {shown.map((o) => (
            <div key={o.id} className={`pf-option ${String(o.id) === String(activeId) ? "pf-option-active" : ""}`}
              onClick={() => { onPick(o); setOpen(false); setQ(""); }}>
              {o.name}
            </div>
          ))}
          {!shown.length && <div className="pf-option" style={{ color: "#9aa3b5" }}>No match</div>}
        </div>
      )}
    </div>
  );
}

export default function ProceduralMapFilters({ onFilter, onClear, activeFilter, vendorCount, catCount, vendors = [], subCategories = [], countries = [] }) {
  const [keyword, setKeyword] = useState("");
  const [catOpen, setCatOpen] = useState(false);
  const [acOpen, setAcOpen] = useState(false);
  const debounceRef = useRef(null);
  const kwRef = useRef(null);
  const catRef = useRef(null);

  const activeCat = activeFilter?.type === "category" ? CATEGORIES.find((c) => c.code === activeFilter.code) : null;

  const matches = keyword.trim().length >= 1
    ? vendors.filter((v) => v.name.toLowerCase().includes(keyword.toLowerCase().trim()))
        .sort((a, b) => {
          const k = keyword.toLowerCase().trim();
          return (a.name.toLowerCase().startsWith(k) ? 0 : 1) - (b.name.toLowerCase().startsWith(k) ? 0 : 1) || a.name.localeCompare(b.name);
        }).slice(0, 8)
    : [];

  const handleKeyword = useCallback((e) => {
    const val = e.target.value;
    setKeyword(val);
    setAcOpen(true);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => onFilter({ type: "keyword", value: val }), 250);
  }, [onFilter]);

  const pickVendor = (v) => { setAcOpen(false); if (v?.href) window.location.href = v.href; };

  const handleCategory = (cat) => {
    setCatOpen(false);
    if (activeFilter?.type === "category" && activeFilter.code === cat.code) { handleClear(); return; }
    setKeyword("");
    onFilter({ type: "category", key: cat.key, code: cat.code });
  };

  const handleClear = () => {
    setKeyword(""); setCatOpen(false); clearTimeout(debounceRef.current);
    onClear();
  };

  useEffect(() => {
    const h = (e) => {
      if (kwRef.current && !kwRef.current.contains(e.target)) setAcOpen(false);
      if (catRef.current && !catRef.current.contains(e.target)) setCatOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const hasFilter = !!(keyword || activeFilter);

  return (
    <div className="pmf-bar">
      {/* Keywords */}
      <div className="pf-col" style={{ position: "relative" }} ref={kwRef}>
        <label className="pf-label">Keywords</label>
        <div className="pf-ctl pf-kw">
          <span className="pf-icon"><IconSearch /></span>
          <input className="pf-input" placeholder="Search a vendor…" value={keyword}
            onChange={handleKeyword} onFocus={() => keyword && setAcOpen(true)} />
        </div>
        {acOpen && keyword.trim() && (
          <div className="pf-dropdown">
            {matches.length ? matches.map((v, i) => (
              <div key={i} className="pf-option" onClick={() => pickVendor(v)}>
                <span className="pf-dot" style={{ background: `hsl(${v.hue},72%,50%)` }} />{v.name}
                <span style={{ marginLeft: "auto", color: "#9aa3b5", fontSize: 11 }}>{v.code}</span>
              </div>
            )) : <div className="pf-option" style={{ color: "#9aa3b5" }}>No vendor matches "{keyword.trim()}"</div>}
          </div>
        )}
      </div>

      {/* Category */}
      <div className="pf-col" style={{ position: "relative" }} ref={catRef}>
        <label className="pf-label">Category</label>
        <div className={`pf-ctl pf-select ${activeCat ? "pf-active" : ""}`} onClick={() => setCatOpen(!catOpen)}>
          <span style={{ color: activeCat ? "#2f6fe0" : "#9aa3b5", fontWeight: activeCat ? 600 : 400, fontSize: 13, whiteSpace: "nowrap" }}>
            {activeCat ? activeCat.code : "Select category"}
          </span>
          <IconChevron open={catOpen} />
        </div>
        {catOpen && (
          <div className="pf-dropdown">
            <div className="pf-option" style={{ color: "#9aa3b5" }} onClick={handleClear}>All</div>
            {CATEGORIES.map((c) => (
              <div key={c.key} className={`pf-option ${activeCat?.code === c.code ? "pf-option-active" : ""}`} onClick={() => handleCategory(c)}>
                <span className="pf-dot" style={{ background: `hsl(${c.hue},72%,50%)` }} />
                <strong style={{ minWidth: 42 }}>{c.code}</strong>
                <span style={{ color: "#5a6a85", fontSize: 12, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.full}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Sub-Category */}
      <Dropdown label="Sub-Category" placeholder="Select sub-category"
        options={subCategories}
        activeId={activeFilter?.type === "sub" ? activeFilter.value : null}
        onPick={(o) => o ? onFilter({ type: "sub", value: o.id }) : handleClear()} />

      {/* Country — based on the countries a vendor is active in (normalized) */}
      <Dropdown label="Country" placeholder="Select country"
        options={countries}
        activeId={activeFilter?.type === "active" ? activeFilter.value : null}
        onPick={(o) => o ? onFilter({ type: "active", value: o.id }) : handleClear()} />

      {/* Right: counter / clear */}
      <div className="pmf-right">
        {!hasFilter && vendorCount > 0 && (
          <div className="pf-counter">
            <span className="pf-counter-n">{vendorCount}</span>
            <span className="pf-counter-sep">|</span>
            <span className="pf-counter-lbl">{catCount || 14} categories</span>
          </div>
        )}
        {hasFilter && (
          <button className="pf-clear-btn" onClick={handleClear} title="Clear (Esc)">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12" /></svg>
          </button>
        )}
      </div>

      <style jsx>{`
        .pmf-bar {
          display: flex; align-items: flex-end; gap: 28px;
          padding: 14px 38px; background: rgba(255,255,255,0.92);
          backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
          border-bottom: 1px solid #E1E7F1; flex-wrap: wrap; position: relative; z-index: 40;
        }
        .pf-search {
          width: calc(100% - 16px); margin: 8px 8px 6px; padding: 8px 12px;
          border: 1.5px solid #E1E7F1; border-radius: 8px; font-size: 13px;
          outline: none; color: #0A1A33; box-sizing: border-box;
        }
        .pf-search:focus { border-color: #2f6fe0; }
        .pf-col { display: flex; flex-direction: column; gap: 6px; position: relative; }
        .pf-label {
          font-family: 'JetBrains Mono', monospace; font-size: 10px;
          letter-spacing: .08em; text-transform: uppercase; color: #0A1A33; font-weight: 500;
        }
        .pf-ctl {
          display: flex; align-items: center; gap: 6px;
          border: 1.5px solid transparent; background: #F4F7FC;
          border-radius: 100px; padding: 8px 14px; min-width: 150px;
          cursor: pointer; user-select: none; transition: border-color .2s, background .2s;
        }
        .pf-kw { cursor: text; }
        .pf-ctl:hover { border-color: #adc0dc; }
        .pf-select { justify-content: space-between; }
        .pf-active { border-color: #2f6fe0 !important; background: #f4f8ff; }
        .pf-icon { color: #8a93a6; display: flex; flex-shrink: 0; }
        .pf-input { border: none; outline: none; background: transparent; font-size: 13px; color: #0A1A33; width: 140px; }
        .pf-input::placeholder { color: #9aa3b5; }
        .pf-dropdown {
          position: absolute; top: calc(100% + 5px); left: 0; min-width: 230px;
          background: #fff; border: 1px solid #E1E7F1; border-radius: 12px;
          box-shadow: 0 12px 40px -8px rgba(10,26,51,.18); z-index: 200;
          max-height: 300px; overflow-y: auto; animation: dropIn .15s ease;
        }
        @keyframes dropIn { from { transform: translateY(-6px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .pf-option {
          display: flex; align-items: center; gap: 9px;
          padding: 9px 14px; font-size: 13px; color: #3a4a66; cursor: pointer;
          border-bottom: 1px solid #f4f7fc; transition: background .1s; white-space: nowrap;
        }
        .pf-option:last-child { border-bottom: none; }
        .pf-option:hover { background: #f4f8ff; color: #0e2c5c; }
        .pf-option-active { background: #eef4ff; color: #2f6fe0; font-weight: 600; }
        .pf-dot { width: 9px; height: 9px; border-radius: 50%; flex-shrink: 0; }
        .pmf-right { margin-left: auto; display: flex; align-items: center; gap: 10px; align-self: flex-end; margin-bottom: 8px; }
        .pf-counter { display: flex; align-items: center; gap: 7px; font-family: 'JetBrains Mono', monospace; }
        .pf-counter-n { font-size: 17px; font-weight: 700; color: #2f6fe0; }
        .pf-counter-sep { color: #D0D8E8; }
        .pf-counter-lbl { font-size: 11px; color: #8a93a6; text-transform: uppercase; letter-spacing: .06em; }
        .pf-clear-btn {
          display: flex; align-items: center; justify-content: center;
          width: 30px; height: 30px; border-radius: 50%; background: #F4F7FC;
          border: 1.5px solid #E1E7F1; color: #626b80; cursor: pointer; transition: all .2s;
        }
        .pf-clear-btn:hover { background: #fee; border-color: #f5a0a0; color: #cc0000; }
      `}</style>
    </div>
  );
}

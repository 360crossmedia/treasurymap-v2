"use client";
import { useState, useRef, useCallback, useEffect } from "react";
import { CAT_META } from "./catMeta";

const CATEGORIES = Object.entries(CAT_META)
  .map(([key, v]) => ({ key, code: v.code, full: v.full, hue: v.hue, n: parseInt(key.split("-")[1]) }))
  .sort((a, b) => a.n - b.n);

const IconSearch = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4-4" /></svg>
);
const IconChevron = ({ open }) => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"
    style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform .2s", flexShrink: 0 }}><path d="M6 9l6 6 6-6" /></svg>
);
const IconCheck = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#2f6fe0" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: "auto", flexShrink: 0 }}><path d="M20 6L9 17l-5-5" /></svg>
);

// Generic searchable dropdown — single-select (Country) or multi-select (Sub-Category).
function Dropdown({ label, placeholder, options, activeId, onPick, multi = false, selectedIds = [], onToggle, onClearMulti }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const ref = useRef(null);
  const selSet = new Set((selectedIds || []).map(String));
  const active = options.find((o) => String(o.id) === String(activeId));
  const searchable = options.length > 12;
  const shown = q.trim() ? options.filter((o) => o.name.toLowerCase().includes(q.toLowerCase().trim())) : options;
  const isActive = multi ? selSet.size > 0 : !!active;
  const triggerText = multi
    ? (selSet.size ? `${selSet.size} selected` : placeholder)
    : (active ? active.name : placeholder);
  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) { setOpen(false); setQ(""); } };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  return (
    <div className="pf-col" ref={ref}>
      <label className="pf-label">{label}</label>
      <div className={`pf-ctl pf-select ${isActive ? "pf-active" : ""}`} onClick={() => setOpen(!open)}>
        <span className={isActive ? "pf-val" : "pf-ph"}>{triggerText}</span>
        <IconChevron open={open} />
      </div>
      {open && (
        <div className="pf-dropdown">
          {searchable && (
            <input className="pf-search" autoFocus placeholder="Search…" value={q}
              onChange={(e) => setQ(e.target.value)} onClick={(e) => e.stopPropagation()} />
          )}
          <div className="pf-option pf-all"
            onClick={() => { if (multi) { onClearMulti?.(); } else { onPick(null); setOpen(false); setQ(""); } }}>
            {multi ? "Clear sub-categories" : "All"}
          </div>
          {shown.map((o) => {
            const sel = multi ? selSet.has(String(o.id)) : String(o.id) === String(activeId);
            return (
              <div key={o.id} className={`pf-option ${sel ? "pf-option-active" : ""}`}
                onClick={() => { if (multi) { onToggle(o); } else { onPick(o); setOpen(false); setQ(""); } }}>
                {o.name}{sel && <IconCheck />}
              </div>
            );
          })}
          {!shown.length && <div className="pf-option pf-ph">No match</div>}
        </div>
      )}
    </div>
  );
}

export default function ProceduralMapFilters({
  filters = {}, catSels = [], subs = [], onAddFilter, onRemoveFilter, onToggleCat, onRemoveCat, onToggleSub, onRemoveSub, onClear,
  vendors = [], subCategories = [], countries = [],
  matchCount, totalVendors = 0, totalCats = 14,
}) {
  const [keyword, setKeyword] = useState(filters.keyword?.value || "");
  const [catOpen, setCatOpen] = useState(false);
  const [acOpen, setAcOpen] = useState(false);
  const debounceRef = useRef(null);
  const kwRef = useRef(null);
  const catRef = useRef(null);

  const catCodeSet = new Set(catSels.map((c) => c.code));
  // Single-value chips (keyword / active) + multi category & sub-category chips
  const singleChips = Object.values(filters).filter((f) => f && !(f.type === "keyword" && !String(f.value || "").trim()));

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
    debounceRef.current = setTimeout(() => {
      if (val.trim()) onAddFilter({ type: "keyword", value: val, label: `"${val.trim()}"` });
      else onRemoveFilter("keyword");
    }, 250);
  }, [onAddFilter, onRemoveFilter]);

  const pickVendor = (v) => { setAcOpen(false); if (v?.href) window.location.href = v.href; };

  // Multi-select: toggle category, keep the dropdown open to add several
  const pickCategory = (c) => { onToggleCat({ code: c.code, label: c.code, hue: c.hue }); };

  const clearAll = () => { setKeyword(""); clearTimeout(debounceRef.current); onClear(); };

  useEffect(() => {
    const h = (e) => {
      if (kwRef.current && !kwRef.current.contains(e.target)) setAcOpen(false);
      if (catRef.current && !catRef.current.contains(e.target)) setCatOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const filtersActive = singleChips.length > 0 || catSels.length > 0 || subs.length > 0;

  const chipText = (f) => {
    if (f.type === "keyword") return f.label;
    if (f.type === "category") return f.code;
    if (f.type === "active") return countries.find((c) => String(c.id) === String(f.value))?.name || "Country";
    return "";
  };
  const removeChip = (f) => { if (f.type === "keyword") setKeyword(""); onRemoveFilter(f.type); };

  return (
    <div className="pmf-bar">
      <div className="pmf-controls">
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
                  <span className="pf-code">{v.code}</span>
                </div>
              )) : <div className="pf-option pf-ph">No vendor matches "{keyword.trim()}"</div>}
            </div>
          )}
        </div>

        {/* Category — multi-select (OR within facet) */}
        <div className="pf-col" style={{ position: "relative" }} ref={catRef}>
          <label className="pf-label">Category</label>
          <div className={`pf-ctl pf-select ${catSels.length ? "pf-active" : ""}`} onClick={() => setCatOpen(!catOpen)}>
            <span className={catSels.length ? "pf-val" : "pf-ph"}>
              {catSels.length === 0 ? "Select category" : catSels.length === 1 ? catSels[0].code : `${catSels.length} selected`}
            </span>
            <IconChevron open={catOpen} />
          </div>
          {catOpen && (
            <div className="pf-dropdown">
              <div className="pf-option pf-all" onClick={() => catSels.forEach((c) => onRemoveCat(c.code))}>Clear categories</div>
              {CATEGORIES.map((c) => {
                const sel = catCodeSet.has(c.code);
                return (
                  <div key={c.key} className={`pf-option ${sel ? "pf-option-active" : ""}`} onClick={() => pickCategory(c)}>
                    <span className="pf-dot" style={{ background: `hsl(${c.hue},72%,50%)` }} />
                    <strong style={{ minWidth: 42 }}>{c.code}</strong>
                    <span className="pf-sub">{c.full}</span>
                    {sel && <IconCheck />}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Sub-Category — multi-select (OR within facet) */}
        <Dropdown label="Sub-Category" placeholder="Select sub-categories" options={subCategories}
          multi selectedIds={subs.map((s) => s.value)}
          onToggle={(o) => onToggleSub({ value: o.id, label: o.name })}
          onClearMulti={() => subs.forEach((s) => onRemoveSub(s.value))} />

        {/* Country */}
        <Dropdown label="Country" placeholder="Select country" options={countries}
          activeId={filters.active?.value}
          onPick={(o) => o ? onAddFilter({ type: "active", value: o.id, label: o.name }) : onRemoveFilter("active")} />
      </div>

      {/* Active filter chips */}
      {filtersActive && (
        <div className="pmf-chips">
          {catSels.map((c, i) => (
            <span key={`cat${i}`} className="pf-chip"
              style={{ background: `hsl(${c.hue},70%,94%)`, color: `hsl(${c.hue},55%,30%)`, borderColor: `hsl(${c.hue},50%,82%)` }}>
              <span className="pf-chip-dot" style={{ background: `hsl(${c.hue},72%,50%)` }} />
              {c.code}
              <button className="pf-chip-x" onClick={() => onRemoveCat(c.code)}>✕</button>
            </span>
          ))}
          {singleChips.map((f, i) => (
            <span key={`s${i}`} className="pf-chip">
              {chipText(f)}
              <button className="pf-chip-x" onClick={() => removeChip(f)}>✕</button>
            </span>
          ))}
          {subs.map((s, i) => (
            <span key={`sub${i}`} className="pf-chip">
              {s.label}
              <button className="pf-chip-x" onClick={() => onRemoveSub(s.value)}>✕</button>
            </span>
          ))}
          <button className="pf-clear-all" onClick={clearAll}>Clear all</button>
        </div>
      )}

      <style jsx global>{`
        .pmf-bar {
          background: rgba(255,255,255,0.92); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
          border-bottom: 1px solid #E1E7F1; padding: 14px 38px; position: relative; z-index: 40;
        }
        .pmf-controls { display: flex; align-items: flex-end; gap: 28px; flex-wrap: wrap; }
        .pf-col { display: flex; flex-direction: column; gap: 6px; position: relative; }
        .pf-label { font-family: 'JetBrains Mono', monospace; font-size: 10px; letter-spacing: .08em; text-transform: uppercase; color: #0A1A33; font-weight: 500; }
        .pf-ctl {
          display: flex; align-items: center; gap: 7px; border: 1.5px solid transparent; background: #F4F7FC;
          border-radius: 100px; padding: 9px 15px; min-width: 168px; cursor: pointer; user-select: none;
          transition: border-color .2s, background .2s;
        }
        .pf-kw { cursor: text; }
        .pf-ctl:hover { border-color: #adc0dc; }
        .pf-select { justify-content: space-between; }
        .pf-active { border-color: #2f6fe0 !important; background: #f4f8ff; }
        .pf-icon { color: #8a93a6; display: flex; flex-shrink: 0; }
        .pf-input { border: none; outline: none; background: transparent; font-size: 13px; color: #0A1A33; width: 150px; }
        .pf-input::placeholder { color: #9aa3b5; }
        .pf-val { color: #2f6fe0; font-weight: 600; font-size: 13px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 160px; }
        .pf-ph { color: #9aa3b5; font-size: 13px; }

        .pf-dropdown {
          position: absolute; top: calc(100% + 6px); left: 0; width: 320px; max-width: 90vw;
          background: #fff; border: 1px solid #E1E7F1; border-radius: 12px;
          box-shadow: 0 14px 44px -10px rgba(10,26,51,.2); z-index: 200;
          max-height: 320px; overflow-y: auto; padding: 4px; animation: pfDrop .15s ease;
        }
        @keyframes pfDrop { from { transform: translateY(-6px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .pf-search {
          width: 100%; margin: 4px 0 6px; padding: 9px 12px; border: 1.5px solid #E1E7F1;
          border-radius: 8px; font-size: 13px; outline: none; color: #0A1A33; box-sizing: border-box;
        }
        .pf-search:focus { border-color: #2f6fe0; }
        .pf-option {
          display: flex; align-items: center; gap: 9px; padding: 9px 12px; font-size: 13px;
          color: #3a4a66; cursor: pointer; border-radius: 8px; transition: background .1s; line-height: 1.35;
        }
        .pf-option:hover { background: #f4f8ff; color: #0e2c5c; }
        .pf-option-active { background: #eef4ff; color: #2f6fe0; font-weight: 600; }
        .pf-all { color: #9aa3b5; font-weight: 600; border-bottom: 1px solid #f0f3f8; border-radius: 0; margin-bottom: 2px; }
        .pf-dot { width: 9px; height: 9px; border-radius: 50%; flex-shrink: 0; }
        .pf-sub { color: #5a6a85; font-size: 12px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .pf-code { margin-left: auto; color: #9aa3b5; font-size: 11px; font-family: 'JetBrains Mono', monospace; }

        .pmf-counter { display: flex; flex-direction: column; align-items: flex-start; gap: 0; margin-left: auto; align-self: flex-end; margin-bottom: 3px; }
        .pf-counter-n { font-family: 'JetBrains Mono', monospace; font-size: 20px; font-weight: 700; color: #2f6fe0; line-height: 1.1; }
        .pf-counter-lbl { font-family: 'JetBrains Mono', monospace; font-size: 10px; color: #8a93a6; text-transform: uppercase; letter-spacing: .06em; }

        .pmf-chips { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; margin-top: 14px; }
        .pf-chip {
          display: inline-flex; align-items: center; gap: 7px; padding: 6px 10px 6px 12px;
          background: #eef4ff; border: 1.5px solid #dce8fb; color: #1e3a6e; border-radius: 100px;
          font-size: 13px; font-weight: 600; max-width: 280px;
        }
        .pf-chip > :not(.pf-chip-x):not(.pf-chip-dot) { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .pf-chip-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
        .pf-chip-x { background: none; border: none; cursor: pointer; color: inherit; opacity: .6; font-size: 11px; padding: 0; line-height: 1; flex-shrink: 0; }
        .pf-chip-x:hover { opacity: 1; }
        .pf-clear-all {
          background: none; border: 1.5px solid #E1E7F1; color: #626b80; border-radius: 100px;
          padding: 6px 14px; font-size: 12.5px; font-weight: 600; cursor: pointer; transition: border-color .2s, color .2s;
        }
        .pf-clear-all:hover { border-color: #2f6fe0; color: #2f6fe0; }
      `}</style>
    </div>
  );
}

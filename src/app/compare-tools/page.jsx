"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import styles from "../get-my-list/styles.module.css";
import { url } from "../service/url";
import { cld } from "../utils/cloudinary";
import { providerHref } from "../utils/slugify";
import { CAT_META } from "../components/proceduralMap/catMeta";

const MAX_VENDORS = 5;
const MIN_VENDORS = 2;

// Categories straight from the static metadata (no endpoint dependency).
const CATEGORIES = Object.entries(CAT_META).map(([key, v]) => ({
  id: parseInt(key.split("-")[1], 10),
  name: `${v.code} — ${v.full}`,
  hue: v.hue,
}));

// ── Custom category dropdown ─────────────────────────────────────────────────
function CategorySelect({ categories, value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const selected = categories.find((c) => c.id === value);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className={styles.catSelectWrap} ref={ref}>
      <div
        className={`${styles.catSelectTrigger} ${open ? styles.catSelectTriggerOpen : ""} ${selected ? styles.catSelectTriggerSelected : ""}`}
        onClick={() => setOpen(!open)}
        role="button" tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && setOpen(!open)}
      >
        <span>{selected ? selected.name : "— Select a category —"}</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          strokeWidth="2.4" style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform .2s", flexShrink: 0 }}>
          <path d="M6 9l6 6 6-6" />
        </svg>
      </div>
      {open && (
        <div className={styles.catSelectDropdown}>
          {categories.map((c) => (
            <div key={c.id}
              className={`${styles.catSelectOption} ${c.id === value ? styles.catSelectOptionActive : ""}`}
              onClick={() => { onChange(c.id); setOpen(false); }}>
              {c.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── helpers ──────────────────────────────────────────────────────────────────
function asArray(v) {
  if (Array.isArray(v)) return v;
  if (typeof v === "string") { try { const p = JSON.parse(v); return Array.isArray(p) ? p : []; } catch { return []; } }
  return [];
}
function fmtTurnover(c) {
  if (!c.showTurnover) return null;
  const n = Number(c.turnover);
  if (!n) return null;
  if (n >= 1e9) return "€" + (n / 1e9).toFixed(n % 1e9 ? 1 : 0) + "B";
  if (n >= 1e6) return "€" + Math.round(n / 1e6) + "M";
  if (n >= 1e3) return "€" + Math.round(n / 1e3) + "K";
  return "€" + n;
}

export default function CompareToolsPage() {
  const [companies, setCompanies] = useState([]);
  const [subMap, setSubMap] = useState({});
  const [countryMap, setCountryMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [categoryId, setCategoryId] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);

  // Load data once
  useEffect(() => {
    (async () => {
      try {
        const [c, s, co] = await Promise.all([
          fetch(`${url}/api/v1/companies`).then((r) => r.json()),
          fetch(`${url}/api/v1/subCategories`).then((r) => r.json()).catch(() => []),
          fetch(`${url}/api/v1/countries`).then((r) => r.json()).catch(() => []),
        ]);
        setCompanies(Array.isArray(c) ? c : []);
        setSubMap(Object.fromEntries((s || []).map((x) => [x.id, x.name])));
        setCountryMap(Object.fromEntries((co || []).map((x) => [x.id, x.name])));
        const preId = parseInt(sessionStorage.getItem("comparePreCategoryId") || "", 10);
        if (preId) { setCategoryId(preId); sessionStorage.removeItem("comparePreCategoryId"); }
      } catch {
        setError("Could not load vendor data. Please try again.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Vendors active in the chosen category (deduped by name)
  const vendors = useMemo(() => {
    if (!categoryId) return [];
    const seen = new Set();
    return companies
      .filter((c) => c.live && c.logo && asArray(c.companyCategories).includes(categoryId))
      .filter((c) => { const k = (c.name || "").trim().toLowerCase(); if (seen.has(k)) return false; seen.add(k); return true; })
      .sort((a, b) => (a.name || "").localeCompare(b.name || ""));
  }, [companies, categoryId]);

  // Reset selection when category changes
  useEffect(() => { setSelectedIds([]); }, [categoryId]);

  const selectedVendors = useMemo(
    () => selectedIds.map((id) => companies.find((c) => c.id === id)).filter(Boolean),
    [selectedIds, companies]
  );

  const toggleVendor = (vid) => {
    setSelectedIds((prev) => {
      if (prev.includes(vid)) return prev.filter((x) => x !== vid);
      if (prev.length >= MAX_VENDORS) return prev;
      return [...prev, vid];
    });
  };

  const selectedCategory = CATEGORIES.find((c) => c.id === categoryId);
  const showTable = selectedVendors.length >= MIN_VENDORS;

  // Comparison helpers
  const officeNames = (c) => asArray(c.companyOffices).map((id) => countryMap[id]).filter(Boolean);

  // Profile completeness (so the treasurer can weight a sparse profile fairly)
  const COMPLETE_CHECKS = [
    (c) => (c.productName || "").trim() && c.productName !== "None",
    (c) => (c.description || "").trim(),
    (c) => c.employees,
    (c) => c.creationDate,
    (c) => (c.companyWebsite || "").trim(),
    (c) => (c.location || "").trim(),
    (c) => asArray(c.companySubcategories).length > 0,
    (c) => asArray(c.companyOffices).length > 0,
  ];
  const completeness = (c) => Math.round(COMPLETE_CHECKS.filter((fn) => fn(c)).length / COMPLETE_CHECKS.length * 100);

  // Fact rows — each getter returns null when "not declared" (rendered neutrally,
  // never as a deficiency). Turnover only shows if EVERY compared vendor declares it.
  const allDeclareTurnover = selectedVendors.length > 0 && selectedVendors.every((c) => fmtTurnover(c));
  const RAW_ROWS = [
    { label: "Product", get: (c) => ((c.productName && c.productName !== "None") ? [c.productName, c.productVersion && c.productVersion !== "None" ? `v${c.productVersion}` : ""].filter(Boolean).join(" ") : null) },
    { label: "What it does", get: (c) => c.description || null, long: true },
    { label: "Headquarters", get: (c) => c.location || null },
    { label: "Active in", get: (c) => { const o = officeNames(c); return o.length ? `${o.length} ${o.length > 1 ? "countries" : "country"}` : null; }, sub: (c) => officeNames(c).slice(0, 6).join(", ") },
    { label: "Employees", get: (c) => (c.employees ? Number(c.employees).toLocaleString() : null) },
    ...(allDeclareTurnover ? [{ label: "Turnover", get: (c) => fmtTurnover(c) }] : []),
    { label: "Founded", get: (c) => c.creationDate || null },
    { label: "Website", link: (c) => c.companyWebsite || null },
    { label: "Tags", chips: (c) => asArray(c.keywords) },
  ];
  // Hide a row when no compared vendor has any value for it
  const hasAny = (row) => selectedVendors.some((v) =>
    row.chips ? row.chips(v).length : row.link ? row.link(v) : row.get(v));
  const ROWS = RAW_ROWS.filter(hasAny);

  // Capability coverage matrix — union of self-declared sub-categories, ✓ / not declared
  const coverageSubs = (() => {
    const m = new Map();
    selectedVendors.forEach((v) => asArray(v.companySubcategories).forEach((id) => { if (subMap[id]) m.set(id, subMap[id]); }));
    return [...m.entries()].sort((a, b) => a[1].localeCompare(b[1])); // [id, name]
  })();

  return (
    <div>
      <Navbar buttonLabel="Log In" />
      <div className={styles.page}>
        <div className={styles.container}>

          <header className={styles.hero}>
            <h1 className={styles.heroTitle}>Compare treasury vendors side-by-side</h1>
            <p className={styles.heroSubtitle}>
              Pick a category and select {MIN_VENDORS}–{MAX_VENDORS} solutions. The comparison
              appears instantly — multi-criteria, no recommendation, just the facts. Free, no sign-up.
            </p>
          </header>

          {error && <div className={styles.errorBox} role="alert">{error}</div>}

          {/* Step 1 — Category */}
          <div className={styles.card}>
            <h2 className={styles.sectionTitle}>1. Pick a category</h2>
            <p className={styles.sectionSubtitle}>You can only compare vendors within the same category.</p>
            <div className={styles.field}>
              <CategorySelect categories={CATEGORIES} value={categoryId} onChange={setCategoryId} />
            </div>
          </div>

          {/* Step 2 — Vendor picker */}
          {categoryId && (
            <div className={styles.card}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4, flexWrap: "wrap", gap: 10 }}>
                <h2 className={styles.sectionTitle} style={{ margin: 0 }}>
                  2. Pick {MIN_VENDORS} to {MAX_VENDORS} vendors
                </h2>
                <span className={selectedIds.length ? styles.vendorCounter : styles.vendorCounterEmpty}>
                  {selectedIds.length ? `${selectedIds.length} / ${MAX_VENDORS} selected` : `Min ${MIN_VENDORS} · Max ${MAX_VENDORS}`}
                </span>
              </div>
              <p className={styles.sectionSubtitle}>{selectedCategory?.name} — click a card to add it to the comparison.</p>

              {loading ? (
                <p className={styles.fieldHint}>Loading vendors…</p>
              ) : (
                <div className={styles.vendorPickerGrid}>
                  {vendors.map((v) => {
                    const isSel = selectedIds.includes(v.id);
                    const canSel = isSel || selectedIds.length < MAX_VENDORS;
                    return (
                      <button key={v.id} type="button" disabled={!canSel} onClick={() => toggleVendor(v.id)}
                        className={`${styles.vendorPickerCard} ${isSel ? styles.vendorPickerCardSelected : ""}`}>
                        {v.logo ? (
                          <img src={cld(v.logo, { w: 160 })} alt={`${v.name} logo`} className={styles.vendorPickerLogo} />
                        ) : (
                          <div className={styles.vendorPickerLogoPlaceholder}>{(v.name || "?").slice(0, 3).toUpperCase()}</div>
                        )}
                        <span className={styles.vendorPickerName}>{v.name}</span>
                        {isSel && <span className={styles.vendorPickerCheck}>✓</span>}
                      </button>
                    );
                  })}
                </div>
              )}
              {!loading && vendors.length === 0 && <p className={styles.fieldHint}>No vendors mapped in this category yet.</p>}
            </div>
          )}

          {/* Inline comparison table */}
          {categoryId && selectedVendors.length > 0 && selectedVendors.length < MIN_VENDORS && (
            <p className="cmp-hint">Select at least one more vendor to see the comparison.</p>
          )}

          {showTable && (
            <div className="cmp-wrap">
              {/* Transparency banner — self-declared data */}
              <div className="cmp-disclaimer">
                <span className="cmp-disclaimer-i">ℹ</span>
                <span>
                  Profiles are <strong>self-declared by the vendors</strong>. A blank field means it
                  wasn’t provided — <strong>not</strong> that the capability is missing. For a normalised,
                  enriched analysis, use <a href="/get-my-list">Make my Selection</a>.
                </span>
              </div>

              <div className="cmp-scroll">
                <table className="cmp-table">
                  <thead>
                    <tr>
                      <th className="cmp-rowhead cmp-corner" />
                      {selectedVendors.map((v) => {
                        const pct = completeness(v);
                        return (
                          <th key={v.id} className="cmp-vhead">
                            <button className="cmp-remove" onClick={() => toggleVendor(v.id)} aria-label={`Remove ${v.name}`}>✕</button>
                            <a href={providerHref({ name: v.name, id: v.id })} className="cmp-vlogo">
                              {v.logo ? <img src={cld(v.logo, { w: 200 })} alt={v.name} /> : <span>{(v.name || "?").slice(0, 3).toUpperCase()}</span>}
                            </a>
                            <a href={providerHref({ name: v.name, id: v.id })} className="cmp-vname">{v.name}</a>
                            <span className={`cmp-complete ${pct >= 75 ? "hi" : pct >= 40 ? "mid" : "lo"}`} title="How complete this vendor's self-declared profile is">
                              profile {pct}%
                            </span>
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {ROWS.map((row) => (
                      <tr key={row.label}>
                        <td className="cmp-rowhead">{row.label}</td>
                        {selectedVendors.map((v) => (
                          <td key={v.id} className={`cmp-cell ${row.long ? "cmp-cell-long" : ""}`}>
                            {row.chips ? (
                              (() => { const arr = row.chips(v); return arr.length
                                ? <div className="cmp-chips">{arr.slice(0, 8).map((x, i) => <span key={i} className="cmp-chip">{x}</span>)}{arr.length > 8 && <span className="cmp-chip cmp-chip-more">+{arr.length - 8}</span>}</div>
                                : <span className="cmp-nd">Not declared</span>; })()
                            ) : row.link ? (
                              row.link(v) ? <a href={row.link(v)} target="_blank" rel="noopener noreferrer" className="cmp-link">Visit site ↗</a> : <span className="cmp-nd">Not declared</span>
                            ) : (
                              (() => { const val = row.get(v); return val
                                ? <><span className={row.long ? "cmp-text-long" : ""}>{val}</span>{row.sub && row.sub(v) && <span className="cmp-subtext">{row.sub(v)}</span>}</>
                                : <span className="cmp-nd">Not declared</span>; })()
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Capability coverage matrix — self-declared sub-categories (✓ / not declared) */}
              {coverageSubs.length > 0 && (
                <div className="cmp-cov">
                  <div className="cmp-cov-head">
                    <h3>Capability coverage</h3>
                    <span>self-declared — which functions each vendor says it covers</span>
                  </div>
                  <div className="cmp-scroll">
                    <table className="cmp-table">
                      <thead>
                        <tr>
                          <th className="cmp-rowhead cmp-corner" />
                          {selectedVendors.map((v) => (
                            <th key={v.id} className="cmp-vhead cmp-vhead-slim">{v.name}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {coverageSubs.map(([id, name]) => (
                          <tr key={id}>
                            <td className="cmp-rowhead cmp-rowhead-norm">{name}</td>
                            {selectedVendors.map((v) => {
                              const has = asArray(v.companySubcategories).includes(id);
                              return (
                                <td key={v.id} className="cmp-cell">
                                  {has ? <span className="cmp-yes">✓</span> : <span className="cmp-no">—</span>}
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Soft conversion CTA → Make my Selection */}
              <div className="cmp-cta">
                <div className="cmp-cta-text">
                  <strong>This is what vendors declare about themselves.</strong>
                  <span>For a fair, enriched shortlist — normalised and cross-checked beyond self-reported profiles — let our AI build your personalised long list.</span>
                </div>
                <a href="/get-my-list" className="cmp-cta-btn">Make my Selection →</a>
              </div>
            </div>
          )}

        </div>
      </div>
      <Footer />

      <style jsx>{`
        .cmp-hint { text-align: center; color: #5a6a85; font-size: 14px; margin: 8px 0 0; }
        .cmp-wrap { margin-top: 26px; }
        .cmp-scroll {
          overflow-x: auto; border: 1px solid #e6ecf5; border-radius: 16px;
          background: #fff; box-shadow: 0 10px 36px -16px rgba(10,26,51,.18);
        }
        .cmp-table { border-collapse: collapse; width: 100%; min-width: 560px; }
        .cmp-table th, .cmp-table td { border-bottom: 1px solid #eef2f8; vertical-align: top; }
        .cmp-rowhead {
          position: sticky; left: 0; z-index: 2; background: #f7f9fc;
          font-size: 12px; font-weight: 700; color: #45556e; text-transform: uppercase;
          letter-spacing: .04em; padding: 16px 16px; white-space: nowrap; min-width: 130px;
          border-right: 1px solid #eef2f8;
        }
        .cmp-corner { background: #fff; border-bottom: none; }
        .cmp-vhead {
          background: #fff; padding: 18px 16px 16px; min-width: 168px; text-align: center;
          position: relative; border-right: 1px solid #f3f6fb;
        }
        .cmp-remove {
          position: absolute; top: 8px; right: 8px; width: 24px; height: 24px;
          border: none; border-radius: 50%; background: #f1f4f9; color: #8a93a6;
          cursor: pointer; font-size: 11px; line-height: 1; transition: background .15s, color .15s;
        }
        .cmp-remove:hover { background: #ffe1e1; color: #c0392b; }
        .cmp-vlogo { display: flex; align-items: center; justify-content: center; height: 46px; margin-bottom: 10px; }
        .cmp-vlogo img { max-width: 130px; max-height: 46px; object-fit: contain; }
        .cmp-vlogo span { font-weight: 800; color: #2f6fe0; }
        .cmp-vname { display: block; font-size: 14px; font-weight: 700; color: #0e2c5c; text-decoration: none; }
        .cmp-vname:hover { text-decoration: underline; }
        .cmp-cell { padding: 14px 16px; font-size: 13.5px; color: #2a3c5a; text-align: center; border-right: 1px solid #f3f6fb; }
        .cmp-cell-long { text-align: left; }
        .cmp-text-long { display: block; text-align: left; line-height: 1.5; font-size: 13px; color: #45556e; }
        .cmp-subtext { display: block; font-size: 11.5px; color: #8a93a6; margin-top: 3px; line-height: 1.4; }
        .cmp-empty { color: #c2cad8; }
        .cmp-nd { color: #b3bdcc; font-style: italic; font-size: 12.5px; }

        .cmp-disclaimer {
          display: flex; align-items: flex-start; gap: 10px;
          background: #fff8ec; border: 1px solid #f3e2c0; border-radius: 12px;
          padding: 12px 16px; margin-bottom: 16px; font-size: 13px; color: #6b5a36; line-height: 1.5;
        }
        .cmp-disclaimer-i {
          flex-shrink: 0; width: 20px; height: 20px; border-radius: 50%;
          background: #f0c674; color: #5a4716; font-weight: 700; font-size: 12px;
          display: flex; align-items: center; justify-content: center; margin-top: 1px;
        }
        .cmp-disclaimer a { color: #2f6fe0; font-weight: 600; text-decoration: none; }
        .cmp-disclaimer a:hover { text-decoration: underline; }

        .cmp-complete {
          display: inline-block; margin-top: 7px; font-family: 'JetBrains Mono', monospace;
          font-size: 10.5px; font-weight: 600; padding: 2px 8px; border-radius: 100px;
        }
        .cmp-complete.hi  { background: #e4f6ec; color: #1f8a52; }
        .cmp-complete.mid { background: #fdf3e0; color: #b07d22; }
        .cmp-complete.lo  { background: #fdeaea; color: #c0392b; }

        .cmp-cov { margin-top: 26px; }
        .cmp-cov-head { margin-bottom: 12px; }
        .cmp-cov-head h3 { font-size: 17px; font-weight: 700; color: #0e2c5c; margin: 0; display: inline; }
        .cmp-cov-head span { font-size: 12.5px; color: #8a93a6; margin-left: 10px; }
        .cmp-vhead-slim { min-width: 120px; padding: 12px 14px; font-size: 13px; font-weight: 700; color: #0e2c5c; }
        .cmp-rowhead-norm { text-transform: none; font-weight: 600; font-size: 12.5px; color: #2a3c5a; letter-spacing: 0; }
        .cmp-yes { color: #1f8a52; font-weight: 800; font-size: 15px; }
        .cmp-no { color: #d2d9e4; }
        .cmp-chips { display: flex; flex-wrap: wrap; gap: 5px; justify-content: center; }
        .cmp-cell-long .cmp-chips { justify-content: flex-start; }
        .cmp-chip {
          font-size: 11px; font-weight: 600; color: #1f4a7a; background: #eef4fc;
          border: 1px solid #dce8f8; border-radius: 100px; padding: 3px 9px; line-height: 1.4;
        }
        .cmp-chip-more { background: #e9edf4; color: #5a6a85; border-color: #dfe5ee; }
        .cmp-link { color: #2f6fe0; font-weight: 600; text-decoration: none; font-size: 13px; }
        .cmp-link:hover { text-decoration: underline; }
        tbody tr:last-child td { border-bottom: none; }

        .cmp-cta {
          margin-top: 22px; display: flex; align-items: center; justify-content: space-between;
          gap: 18px; flex-wrap: wrap;
          background: linear-gradient(135deg, #eef4ff, #e3edff);
          border: 1px solid #d6e2fb; border-radius: 16px; padding: 20px 24px;
        }
        .cmp-cta-text { display: flex; flex-direction: column; gap: 3px; }
        .cmp-cta-text strong { font-size: 16px; color: #0e2c5c; }
        .cmp-cta-text span { font-size: 13.5px; color: #5a6a85; }
        .cmp-cta-btn {
          flex-shrink: 0; background: linear-gradient(135deg, #4D8DFF, #2f6fe0); color: #fff;
          padding: 12px 24px; border-radius: 100px; font-weight: 600; font-size: 14.5px;
          text-decoration: none; box-shadow: 0 8px 22px -8px rgba(47,111,224,.6);
          transition: transform .18s;
        }
        .cmp-cta-btn:hover { transform: translateY(-2px); color: #fff; }
        @media (max-width: 560px) { .cmp-cta { flex-direction: column; align-items: stretch; text-align: center; } }
      `}</style>
    </div>
  );
}

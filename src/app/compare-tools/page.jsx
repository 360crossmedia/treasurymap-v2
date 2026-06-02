"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import styles from "../get-my-list/styles.module.css";
import { url } from "../service/url";

const MAX_VENDORS = 5;
const MIN_VENDORS = 2;

const STEPS = [
  { n: 1, label: "Category" },
  { n: 2, label: "Vendors"  },
  { n: 3, label: "Send"     },
];

// ── Custom category dropdown (E) ─────────────────────────────────────────────
function CategorySelect({ categories, value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const selected = categories.find(c => c.id === value);

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
        role="button"
        tabIndex={0}
        onKeyDown={e => e.key === "Enter" && setOpen(!open)}
      >
        <span>{selected ? selected.name : "— Select a category —"}</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          strokeWidth="2.4" style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform .2s", flexShrink: 0 }}>
          <path d="M6 9l6 6 6-6"/>
        </svg>
      </div>
      {open && (
        <div className={styles.catSelectDropdown}>
          {categories.map(c => (
            <div
              key={c.id}
              className={`${styles.catSelectOption} ${c.id === value ? styles.catSelectOptionActive : ""}`}
              onClick={() => { onChange(c.id); setOpen(false); }}
            >
              {c.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Progress steps (G) ───────────────────────────────────────────────────────
function ProgressSteps({ current }) {
  return (
    <div className={styles.progressWrap}>
      {STEPS.map((s, i) => {
        const done   = s.n < current;
        const active = s.n === current;
        return (
          <div key={s.n} className={styles.progressStep}>
            <div className={`${styles.progressDot} ${done ? styles.progressDotDone : ""} ${active ? styles.progressDotActive : ""}`}>
              {done ? "✓" : s.n}
            </div>
            <span className={`${styles.progressLabel} ${active ? styles.progressLabelActive : ""}`}>{s.label}</span>
            {i < STEPS.length - 1 && (
              <div className={`${styles.progressLine} ${done ? styles.progressLineDone : ""}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function CompareToolsPage() {
  const router = useRouter();

  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState(null);

  const [vendors, setVendors] = useState([]);
  const [vendorsLoading, setVendorsLoading] = useState(false);
  const [selectedVendorIds, setSelectedVendorIds] = useState([]);

  const [email, setEmail] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [context, setContext] = useState("");
  const [website, setWebsite] = useState("");
  const [gdprAccepted, setGdprAccepted] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // current progress step
  const currentStep = !categoryId ? 1 : selectedVendorIds.length < MIN_VENDORS ? 2 : 3;

  useEffect(() => {
    fetch(`${url}/api/v1/longlist/categories`)
      .then(r => r.json())
      .then(d => {
        setCategories(d.categories || []);
        const preId = parseInt(sessionStorage.getItem("comparePreCategoryId") || "", 10);
        if (preId) { setCategoryId(preId); sessionStorage.removeItem("comparePreCategoryId"); }
      })
      .catch(() => setError("Could not load categories. Is the backend running?"));
  }, []);

  useEffect(() => {
    if (!categoryId) { setVendors([]); setSelectedVendorIds([]); return; }
    setVendorsLoading(true);
    setSelectedVendorIds([]);
    fetch(`${url}/api/v1/longlist/vendors/${categoryId}`)
      .then(r => r.json())
      .then(d => setVendors(d.vendors || []))
      .catch(() => setError("Could not load vendors for this category."))
      .finally(() => setVendorsLoading(false));
  }, [categoryId]);

  const selectedCategory = useMemo(() => categories.find(c => c.id === categoryId), [categories, categoryId]);

  const toggleVendor = (vid) => {
    setSelectedVendorIds(prev => {
      if (prev.includes(vid)) return prev.filter(x => x !== vid);
      if (prev.length >= MAX_VENDORS) return prev;
      return [...prev, vid];
    });
  };

  const isValid =
    categoryId &&
    selectedVendorIds.length >= MIN_VENDORS &&
    selectedVendorIds.length <= MAX_VENDORS &&
    email.trim() &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) &&
    gdprAccepted;

  async function handleSubmit(e) {
    e.preventDefault();
    if (!isValid || submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch(`${url}/api/v1/longlist/compare`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          companyName: companyName.trim() || null,
          categoryId,
          vendorIds: selectedVendorIds,
          context: context.trim() || null,
          website,
        }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || `Error ${res.status}`); setSubmitting(false); return; }
      router.push(`/compare-tools/confirmation?email=${encodeURIComponent(email.trim())}&id=${data.id}`);
    } catch {
      setError("Network error. Check that the backend is reachable.");
      setSubmitting(false);
    }
  }

  return (
    <div>
      <Navbar buttonLabel="Log In" />
      <div className={styles.page}>
        <div className={styles.container}>

          {/* Hero */}
          <header className={styles.hero}>
            <h1 className={styles.heroTitle}>Compare 2 to 5 vendors side-by-side</h1>
            <p className={styles.heroSubtitle}>
              Pick a category, select up to {MAX_VENDORS} solutions, and get a structured
              comparison table delivered to your inbox — multi-criteria, no recommendation, just the facts.
            </p>
          </header>

          {/* Progress bar (G) */}
          <ProgressSteps current={currentStep} />

          {error && <div className={styles.errorBox} role="alert">{error}</div>}

          <form onSubmit={handleSubmit}>

            {/* Step 1 — Category (E: custom dropdown) */}
            <div className={styles.card}>
              <h2 className={styles.sectionTitle}>
                1. Pick a category<span className={styles.required}>*</span>
              </h2>
              <p className={styles.sectionSubtitle}>
                You can only compare vendors within the same category.
              </p>
              <div className={styles.field}>
                <CategorySelect
                  categories={categories}
                  value={categoryId}
                  onChange={(id) => setCategoryId(id)}
                />
              </div>
            </div>

            {/* Step 2 — Vendors (F: counter badge) */}
            {categoryId && (
              <div className={styles.card}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4, flexWrap: "wrap", gap: 10 }}>
                  <h2 className={styles.sectionTitle} style={{ margin: 0 }}>
                    2. Pick {MIN_VENDORS} to {MAX_VENDORS} vendors<span className={styles.required}>*</span>
                  </h2>
                  {/* F: selection counter */}
                  {selectedVendorIds.length > 0 ? (
                    <span className={styles.vendorCounter}>
                      {selectedVendorIds.length} / {MAX_VENDORS} selected
                    </span>
                  ) : (
                    <span className={styles.vendorCounterEmpty}>
                      Min {MIN_VENDORS} · Max {MAX_VENDORS}
                    </span>
                  )}
                </div>
                <p className={styles.sectionSubtitle}>
                  {selectedCategory?.name} — click a card to add it to the comparison.
                </p>

                {vendorsLoading ? (
                  <p className={styles.fieldHint}>Loading vendors…</p>
                ) : (
                  <div className={styles.vendorPickerGrid}>
                    {vendors.map(v => {
                      const isSelected  = selectedVendorIds.includes(v.id);
                      const canSelect   = isSelected || selectedVendorIds.length < MAX_VENDORS;
                      return (
                        <button
                          key={v.id}
                          type="button"
                          disabled={!canSelect}
                          onClick={() => toggleVendor(v.id)}
                          className={`${styles.vendorPickerCard} ${isSelected ? styles.vendorPickerCardSelected : ""}`}
                        >
                          {v.logo ? (
                            <img src={v.logo} alt={`${v.name} logo`} className={styles.vendorPickerLogo} />
                          ) : (
                            <div className={styles.vendorPickerLogoPlaceholder}>
                              {(v.name || "?").slice(0, 3).toUpperCase()}
                            </div>
                          )}
                          <span className={styles.vendorPickerName}>{v.name}</span>
                          {isSelected && (
                            <span className={styles.vendorPickerCheck}>✓</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
                {!vendorsLoading && vendors.length === 0 && (
                  <p className={styles.fieldHint}>No vendors mapped in this category yet.</p>
                )}
              </div>
            )}

            {/* Step 3 — Email + context */}
            {selectedVendorIds.length >= MIN_VENDORS && (
              <>
                <div className={styles.card}>
                  <h2 className={styles.sectionTitle}>3. Where do we send it?</h2>
                  <div className={styles.field}>
                    <label className={styles.fieldLabel}>
                      Email<span className={styles.required}>*</span>
                    </label>
                    <input type="email" className={styles.input} value={email}
                      onChange={e => setEmail(e.target.value)} placeholder="you@company.com" required />
                  </div>
                  <div className={styles.field}>
                    <label className={styles.fieldLabel}>
                      Company name <span className={styles.optional}>optional</span>
                    </label>
                    <input type="text" className={styles.input} value={companyName}
                      onChange={e => setCompanyName(e.target.value)} placeholder="Acme Corp" />
                  </div>
                </div>

                <div className={styles.card}>
                  <h2 className={styles.sectionTitle}>
                    Other specifications <span className={styles.optional}>optional</span>
                  </h2>
                  <p className={styles.sectionSubtitle}>
                    Give us context to tune which criteria matter for you — geography, ERP, scale,
                    regulatory constraints, or specific decision questions.
                  </p>
                  <div className={styles.field}>
                    <textarea className={styles.textarea} value={context}
                      onChange={e => setContext(e.target.value)} rows={4}
                      placeholder="e.g. UK-headquartered, Oracle ERP, 600 bank accounts globally. Focus on payment-formats coverage, SWIFT vs API connectivity, and implementation effort." />
                    <p className={styles.fieldHint}>
                      <strong>The more detail, the better the comparison.</strong> Used to tune criteria — never to recommend a winner.
                    </p>
                  </div>
                </div>

                {/* Honeypot */}
                <div aria-hidden="true" style={{ position: "absolute", left: "-10000px", width: 1, height: 1, overflow: "hidden" }}>
                  <input type="text" name="website" tabIndex={-1} autoComplete="off"
                    value={website} onChange={e => setWebsite(e.target.value)} />
                </div>

                <div className={styles.gdprBox}>
                  <label className={styles.gdprLabel}>
                    <input type="checkbox" checked={gdprAccepted} onChange={e => setGdprAccepted(e.target.checked)} />
                    <span>
                      I consent to TreasuryMap processing my email and the information I provided to generate this comparison.
                      See our <a href="/gdpr" target="_blank" rel="noopener noreferrer">privacy policy</a>.
                    </span>
                  </label>
                </div>

                <div className={styles.submitRow}>
                  <button type="submit" className={styles.submitBtn} disabled={!isValid || submitting}>
                    {submitting && <span className={styles.spinner} />}
                    {submitting ? "Generating…" : "Get my comparison →"}
                  </button>
                  <p className={styles.submitNote}>
                    Branded PDF delivered to your inbox in 2–3 minutes. No account required.
                  </p>
                </div>
              </>
            )}

          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}

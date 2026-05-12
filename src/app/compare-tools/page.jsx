"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import styles from "../get-my-list/styles.module.css";
import { url } from "../service/url";

const MAX_VENDORS = 5;
const MIN_VENDORS = 2;

export default function CompareToolsPage() {
  const router = useRouter();

  // Step 1 — category selection
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState(null);

  // Step 2 — vendors of that category + user selection
  const [vendors, setVendors] = useState([]);
  const [vendorsLoading, setVendorsLoading] = useState(false);
  const [selectedVendorIds, setSelectedVendorIds] = useState([]);

  // Step 3 — contact + optional context
  const [email, setEmail] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [context, setContext] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [gdprAccepted, setGdprAccepted] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Load categories on mount
  useEffect(() => {
    fetch(`${url}/api/v1/longlist/categories`)
      .then((r) => r.json())
      .then((d) => setCategories(d.categories || []))
      .catch(() => setError("Impossible de charger les catégories. Le backend tourne-t-il ?"));
  }, []);

  // Load vendors when category changes
  useEffect(() => {
    if (!categoryId) {
      setVendors([]);
      setSelectedVendorIds([]);
      return;
    }
    setVendorsLoading(true);
    setSelectedVendorIds([]);
    fetch(`${url}/api/v1/longlist/vendors/${categoryId}`)
      .then((r) => r.json())
      .then((d) => setVendors(d.vendors || []))
      .catch(() => setError("Impossible de charger les vendors de cette catégorie."))
      .finally(() => setVendorsLoading(false));
  }, [categoryId]);

  const selectedCategory = useMemo(
    () => categories.find((c) => c.id === categoryId),
    [categories, categoryId]
  );

  const toggleVendor = (vid) => {
    setSelectedVendorIds((prev) => {
      if (prev.includes(vid)) return prev.filter((x) => x !== vid);
      if (prev.length >= MAX_VENDORS) return prev; // cap
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
      if (!res.ok) {
        setError(data.error || `Erreur ${res.status}`);
        setSubmitting(false);
        return;
      }
      router.push(
        `/compare-tools/confirmation?email=${encodeURIComponent(email.trim())}&id=${data.id}`
      );
    } catch {
      setError("Erreur réseau. Vérifie que le backend est joignable.");
      setSubmitting(false);
    }
  }

  return (
    <div>
      <Navbar buttonLabel={"Login"} />
      <div className={styles.page}>
        <div className={styles.container}>
          <header className={styles.hero}>
            <p className={styles.heroEyebrow}>TreasuryMap · Compare Tools</p>
            <h1 className={styles.heroTitle}>Compare 2 to 5 vendors side-by-side</h1>
            <p className={styles.heroSubtitle}>
              Pick a category, select up to {MAX_VENDORS} solutions, and get a structured
              comparison table delivered to your inbox. Multi-criteria, plus and minus per
              vendor — no recommendation, just the facts.
            </p>
          </header>

          {error && (
            <div className={styles.errorBox} role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Step 1 — Category */}
            <div className={styles.card}>
              <h2 className={styles.sectionTitle}>
                1. Pick a category<span className={styles.required}>*</span>
              </h2>
              <p className={styles.sectionSubtitle}>
                You can only compare vendors from the SAME category.
              </p>
              <div className={styles.field}>
                <select
                  className={styles.input}
                  value={categoryId || ""}
                  onChange={(e) => setCategoryId(parseInt(e.target.value, 10) || null)}
                >
                  <option value="">— Select a category —</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Step 2 — Vendors */}
            {categoryId && (
              <div className={styles.card}>
                <h2 className={styles.sectionTitle}>
                  2. Pick {MIN_VENDORS} to {MAX_VENDORS} vendors
                  <span className={styles.required}>*</span>
                </h2>
                <p className={styles.sectionSubtitle}>
                  {selectedCategory?.name}.{" "}
                  {selectedVendorIds.length > 0 ? (
                    <strong>{selectedVendorIds.length} selected</strong>
                  ) : (
                    <span>Tap a vendor card to add it to the comparison.</span>
                  )}
                </p>
                {vendorsLoading ? (
                  <p className={styles.fieldHint}>Loading vendors…</p>
                ) : (
                  <div className={styles.vendorPickerGrid}>
                    {vendors.map((v) => {
                      const isSelected = selectedVendorIds.includes(v.id);
                      const canSelect = isSelected || selectedVendorIds.length < MAX_VENDORS;
                      return (
                        <button
                          key={v.id}
                          type="button"
                          disabled={!canSelect}
                          onClick={() => toggleVendor(v.id)}
                          className={`${styles.vendorPickerCard} ${
                            isSelected ? styles.vendorPickerCardSelected : ""
                          }`}
                        >
                          {v.logo ? (
                            <img
                              src={v.logo}
                              alt={`${v.name} logo`}
                              className={styles.vendorPickerLogo}
                            />
                          ) : (
                            <div className={styles.vendorPickerLogoPlaceholder}>
                              {(v.name || "?").slice(0, 3).toUpperCase()}
                            </div>
                          )}
                          <span className={styles.vendorPickerName}>{v.name}</span>
                          {isSelected && <span className={styles.vendorPickerCheck}>✓</span>}
                        </button>
                      );
                    })}
                  </div>
                )}
                {!vendorsLoading && vendors.length === 0 && (
                  <p className={styles.fieldHint}>
                    No vendors mapped in this category yet.
                  </p>
                )}
              </div>
            )}

            {/* Step 3 — Email + Optional context */}
            {selectedVendorIds.length >= MIN_VENDORS && (
              <>
                <div className={styles.card}>
                  <h2 className={styles.sectionTitle}>3. Where do we send it?</h2>
                  <div className={styles.field}>
                    <label className={styles.fieldLabel}>
                      Email<span className={styles.required}>*</span>
                    </label>
                    <input
                      type="email"
                      className={styles.input}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@company.com"
                      required
                    />
                  </div>
                  <div className={styles.field}>
                    <label className={styles.fieldLabel}>Company name (optional)</label>
                    <input
                      type="text"
                      className={styles.input}
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="Acme Corp"
                    />
                  </div>
                </div>

                <div className={styles.card}>
                  <h2 className={styles.sectionTitle}>
                    Other specifications
                    <span className={styles.optional}>optional</span>
                  </h2>
                  <p className={styles.sectionSubtitle}>
                    Give us context to tune which criteria matter for you — e.g. your
                    geography, ERP, scale, regulatory constraints, or specific decision
                    questions.
                  </p>
                  <div className={styles.field}>
                    <textarea
                      className={styles.textarea}
                      value={context}
                      onChange={(e) => setContext(e.target.value)}
                      placeholder="e.g. UK-headquartered, Oracle ERP, 600 bank accounts globally. We want to implement POBO/COBO. Focus the comparison on payment-formats coverage, SWIFT vs API connectivity, and implementation effort."
                      rows={5}
                    />
                    <p className={styles.fieldHint}>
                      <strong>
                        The more you detail this field, the better the comparison.
                      </strong>{" "}
                      Used to tune the criteria — never to recommend a winner.
                    </p>
                  </div>
                </div>

                {/* Honeypot */}
                <div
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    left: "-10000px",
                    top: "auto",
                    width: "1px",
                    height: "1px",
                    overflow: "hidden",
                  }}
                >
                  <label>
                    Website (do not fill this field)
                    <input
                      type="text"
                      name="website"
                      tabIndex={-1}
                      autoComplete="off"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                    />
                  </label>
                </div>

                <div className={styles.gdprBox}>
                  <label className={styles.gdprLabel}>
                    <input
                      type="checkbox"
                      checked={gdprAccepted}
                      onChange={(e) => setGdprAccepted(e.target.checked)}
                    />
                    <span>
                      I consent to TreasuryMap processing my email and the information I provided
                      to generate this comparison. See our{" "}
                      <a href="/gdpr" target="_blank" rel="noopener noreferrer">
                        privacy policy
                      </a>
                      .
                    </span>
                  </label>
                </div>

                <div className={styles.submitRow}>
                  <button
                    type="submit"
                    className={styles.submitBtn}
                    disabled={!isValid || submitting}
                  >
                    {submitting && <span className={styles.spinner} />}
                    {submitting ? "Generating..." : "Compare Tools"}
                  </button>
                  <p className={styles.submitNote}>
                    You'll receive your branded comparison PDF by email in a few minutes.
                    <br />
                    No account required, no spam.
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

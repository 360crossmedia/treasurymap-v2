"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { url } from "../service/url";
import styles from "./styles.module.css";

const COMPANY_SIZES = ["< €100M", "€100M – €1B", "€1B – €10B", "€10B+"];
const REGIONS = [
  "Europe",
  "North America",
  "APAC",
  "Emerging markets",
  "LATAM",
  "Africa",
  "Middle East",
];
const ERP_CHOICES = [
  "SAP",
  "Microsoft Dynamics",
  "Oracle",
  "Sage",
  "Workday",
  "NetSuite",
  "Other / None",
];
const PRIORITIES = [
  "Cash visibility",
  "Long-term cash flow forecasting",
  "Payments automation",
  "FX & hedging",
  "Bank connectivity",
  "In-house banking",
  "IFRS 9 hedge accounting",
  "Trade finance / bank guarantees",
];
const TECH_LEVELS = [
  "Fast (quick wins, lighter solutions)",
  "Balanced (decent timing + professional)",
  "Premium (long implementation, top-tier)",
];
const IT_STRATEGIES = [
  "Best of Breed",
  "Best of Suite",
  "ERP-embedded",
  "Mix of the above",
];
const IMPLEMENTATION_OPTIONS = [
  "In-house (no integrator)",
  "With external integrators",
];
const NB_BANKS = ["1 – 5", "6 – 10", "11 – 20", "20+"];

const Pill = ({ active, onClick, children, type = "radio" }) => (
  <label
    className={`${type === "radio" ? styles.radioOption : styles.checkOption} ${
      active
        ? type === "radio"
          ? styles.radioOptionActive
          : styles.checkOptionActive
        : ""
    }`}
  >
    <input
      type={type === "radio" ? "radio" : "checkbox"}
      checked={active}
      onChange={onClick}
      readOnly
      style={{ display: "none" }}
    />
    {children}
  </label>
);

export default function GetMyListPage() {
  const router = useRouter();

  // Champs du formulaire
  const [email, setEmail] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [treasuryHQ, setTreasuryHQ] = useState("");
  const [companySize, setCompanySize] = useState("");
  const [regions, setRegions] = useState([]);
  const [erp, setErp] = useState("");
  const [erpOther, setErpOther] = useState("");
  const [priorities, setPriorities] = useState([]);
  const [existingInfra, setExistingInfra] = useState("");
  const [techLevel, setTechLevel] = useState("");
  const [itStrategy, setItStrategy] = useState("");
  const [implementation, setImplementation] = useState("");
  const [nbBanks, setNbBanks] = useState("");
  const [retainedTools, setRetainedTools] = useState("");

  // Catégories (cases à cocher pour la question 10) — fetched depuis le back
  const [categories, setCategories] = useState([]);
  const [selectedCatIds, setSelectedCatIds] = useState([]);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${url}/api/v1/longlist/categories`)
      .then((r) => r.json())
      .then((d) => setCategories(d.categories || []))
      .catch(() => setError("Impossible de charger la liste des catégories. Le backend tourne-t-il ?"));
  }, []);

  const toggleArray = (arr, setArr, value) => {
    setArr(arr.includes(value) ? arr.filter((x) => x !== value) : [...arr, value]);
  };

  const isValid =
    email.trim() &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) &&
    companySize &&
    regions.length > 0 &&
    erp &&
    priorities.length > 0 &&
    techLevel &&
    itStrategy &&
    implementation &&
    nbBanks &&
    selectedCatIds.length > 0;

  async function handleSubmit(e) {
    e.preventDefault();
    if (!isValid || submitting) return;
    setSubmitting(true);
    setError(null);

    const answers = {
      "Company size": companySize,
      "Operating regions": regions,
      ERP: erp === "Other / None" && erpOther.trim() ? `Other: ${erpOther.trim()}` : erp,
      "Treasury priorities": priorities,
      "Existing infrastructure": existingInfra || "(not specified)",
      "Tech preference level": techLevel,
      "IT strategy": itStrategy,
      Implementation: implementation,
      "Number of banks": nbBanks,
    };
    if (treasuryHQ.trim()) answers["Treasury HQ"] = treasuryHQ.trim();
    if (retainedTools.trim()) answers["Retained tools"] = retainedTools.trim();

    try {
      const res = await fetch(`${url}/api/v1/longlist/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          companyName: companyName.trim() || null,
          answers,
          categoryIds: selectedCatIds,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || `Erreur ${res.status}`);
        setSubmitting(false);
        return;
      }
      router.push(
        `/get-my-list/confirmation?email=${encodeURIComponent(email.trim())}&id=${data.id}`
      );
    } catch (err) {
      setError("Erreur réseau. Vérifie que le backend est joignable.");
      setSubmitting(false);
    }
  }

  return (
    <div>
      <Navbar buttonLabel={"Login"} />

      <div className={styles.page}>
        <div className={styles.container}>
          <div className={styles.hero}>
            <h1 className={styles.heroTitle}>Get my Long List</h1>
            <p className={styles.heroSubtitle}>
              Answer 10 quick questions and receive a personalised consultant-style report
              of treasury solutions matched to your profile, based on the Treasury Technology Map.
              Delivered to your inbox in a few minutes.
            </p>
          </div>

          {error && <div className={styles.errorBox}>{error}</div>}

          <form onSubmit={handleSubmit}>
            {/* Bloc 1 — Identité */}
            <div className={styles.card}>
              <h2 className={styles.sectionTitle}>About you</h2>
              <p className={styles.sectionSubtitle}>
                We need your email to send you the report. Company info is optional but improves the report.
              </p>

              <div className={styles.field}>
                <label className={styles.fieldLabel}>
                  Email<span className={styles.required}>*</span>
                </label>
                <input
                  className={styles.input}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  required
                />
              </div>

              <div className={styles.field}>
                <label className={styles.fieldLabel}>Company name</label>
                <input
                  className={styles.input}
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Acme Corp"
                />
              </div>

              <div className={styles.field}>
                <label className={styles.fieldLabel}>Treasury HQ</label>
                <input
                  className={styles.input}
                  type="text"
                  value={treasuryHQ}
                  onChange={(e) => setTreasuryHQ(e.target.value)}
                  placeholder="e.g. Luxembourg, Paris, London"
                />
              </div>
            </div>

            {/* Bloc 2 — Profil organisation (Q1, Q2, Q3, Q9) */}
            <div className={styles.card}>
              <h2 className={styles.sectionTitle}>Your organisation</h2>

              <div className={styles.field}>
                <label className={styles.fieldLabel}>
                  1. What is your company size?<span className={styles.required}>*</span>
                </label>
                <div className={styles.radioGroup}>
                  {COMPANY_SIZES.map((s) => (
                    <Pill key={s} active={companySize === s} onClick={() => setCompanySize(s)}>
                      {s}
                    </Pill>
                  ))}
                </div>
              </div>

              <div className={styles.field}>
                <label className={styles.fieldLabel}>
                  2. Where does your company operate?<span className={styles.required}>*</span>
                </label>
                <div className={styles.checkGroup}>
                  {REGIONS.map((r) => (
                    <Pill
                      key={r}
                      type="check"
                      active={regions.includes(r)}
                      onClick={() => toggleArray(regions, setRegions, r)}
                    >
                      {r}
                    </Pill>
                  ))}
                </div>
                <p className={styles.fieldHint}>Pick all that apply.</p>
              </div>

              <div className={styles.field}>
                <label className={styles.fieldLabel}>
                  3. What ERP / accounting system do you use?<span className={styles.required}>*</span>
                </label>
                <div className={styles.radioGroup}>
                  {ERP_CHOICES.map((e) => (
                    <Pill key={e} active={erp === e} onClick={() => setErp(e)}>
                      {e}
                    </Pill>
                  ))}
                </div>
                {erp === "Other / None" && (
                  <input
                    className={styles.input}
                    style={{ marginTop: 10 }}
                    type="text"
                    value={erpOther}
                    onChange={(e) => setErpOther(e.target.value)}
                    placeholder="Please specify..."
                  />
                )}
              </div>

              <div className={styles.field}>
                <label className={styles.fieldLabel}>
                  9. How many banks do you work with?<span className={styles.required}>*</span>
                </label>
                <div className={styles.radioGroup}>
                  {NB_BANKS.map((n) => (
                    <Pill key={n} active={nbBanks === n} onClick={() => setNbBanks(n)}>
                      {n}
                    </Pill>
                  ))}
                </div>
              </div>
            </div>

            {/* Bloc 3 — Besoins treasury (Q4, Q5) */}
            <div className={styles.card}>
              <h2 className={styles.sectionTitle}>Your treasury priorities</h2>

              <div className={styles.field}>
                <label className={styles.fieldLabel}>
                  4. Biggest treasury priorities<span className={styles.required}>*</span>
                </label>
                <div className={styles.checkGroup}>
                  {PRIORITIES.map((p) => (
                    <Pill
                      key={p}
                      type="check"
                      active={priorities.includes(p)}
                      onClick={() => toggleArray(priorities, setPriorities, p)}
                    >
                      {p}
                    </Pill>
                  ))}
                </div>
                <p className={styles.fieldHint}>Pick all that apply.</p>
              </div>

              <div className={styles.field}>
                <label className={styles.fieldLabel}>
                  5. Treasury infrastructure already in place
                </label>
                <textarea
                  className={styles.textarea}
                  value={existingInfra}
                  onChange={(e) => setExistingInfra(e.target.value)}
                  placeholder="e.g. We have a TMS but it's poorly implemented and we want to replace it..."
                />
              </div>
            </div>

            {/* Bloc 4 — Stratégie (Q6, Q7, Q8) + retained tools */}
            <div className={styles.card}>
              <h2 className={styles.sectionTitle}>Your strategy</h2>

              <div className={styles.field}>
                <label className={styles.fieldLabel}>
                  6. Preferred technology level<span className={styles.required}>*</span>
                </label>
                <div className={styles.radioGroup}>
                  {TECH_LEVELS.map((t) => (
                    <Pill key={t} active={techLevel === t} onClick={() => setTechLevel(t)}>
                      {t}
                    </Pill>
                  ))}
                </div>
              </div>

              <div className={styles.field}>
                <label className={styles.fieldLabel}>
                  7. Preferred IT strategy<span className={styles.required}>*</span>
                </label>
                <div className={styles.radioGroup}>
                  {IT_STRATEGIES.map((s) => (
                    <Pill key={s} active={itStrategy === s} onClick={() => setItStrategy(s)}>
                      {s}
                    </Pill>
                  ))}
                </div>
              </div>

              <div className={styles.field}>
                <label className={styles.fieldLabel}>
                  8. Implementation approach<span className={styles.required}>*</span>
                </label>
                <div className={styles.radioGroup}>
                  {IMPLEMENTATION_OPTIONS.map((o) => (
                    <Pill key={o} active={implementation === o} onClick={() => setImplementation(o)}>
                      {o}
                    </Pill>
                  ))}
                </div>
              </div>

              <div className={styles.field}>
                <label className={styles.fieldLabel}>
                  Existing tools you want to keep (optional)
                </label>
                <textarea
                  className={styles.textarea}
                  value={retainedTools}
                  onChange={(e) => setRetainedTools(e.target.value)}
                  placeholder="e.g. 360T for FX dealing, Bloomberg for data, Treasury Spring for deposits..."
                />
                <p className={styles.fieldHint}>
                  These tools will be flagged "RETAIN" in your report — Claude will recommend integrations rather than replacements.
                </p>
              </div>
            </div>

            {/* Bloc 5 — Catégories (Q10) */}
            <div className={styles.card}>
              <h2 className={styles.sectionTitle}>
                10. What categories of solutions are you looking for?
                <span className={styles.required}>*</span>
              </h2>
              <p className={styles.sectionSubtitle}>
                Tick all categories from the Treasury Technology Map relevant to your selection process.
              </p>

              {categories.length === 0 ? (
                <p style={{ color: "#888" }}>Loading categories...</p>
              ) : (
                <div className={styles.categoryGrid}>
                  {categories.map((c) => {
                    const active = selectedCatIds.includes(c.id);
                    return (
                      <label
                        key={c.id}
                        className={`${styles.catLabel} ${active ? styles.catLabelActive : ""}`}
                      >
                        <input
                          type="checkbox"
                          checked={active}
                          onChange={() => toggleArray(selectedCatIds, setSelectedCatIds, c.id)}
                        />
                        <span>{c.name}</span>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>

            <div className={styles.submitRow}>
              <button
                type="submit"
                className={styles.submitBtn}
                disabled={!isValid || submitting}
              >
                {submitting && <span className={styles.spinner} />}
                {submitting ? "Sending..." : "Get my Long List"}
              </button>
              <p className={styles.submitNote}>
                You'll receive your personalised report by email in a few minutes.
                <br />
                No account required, no spam.
              </p>
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
}

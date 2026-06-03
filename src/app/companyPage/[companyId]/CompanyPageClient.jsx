"use client";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Overview from "../../components/Overview";
import MediaZone from "../../components/MediaZone";
import styles from "../../styles/ProviderPage.module.css";
import { CAT_META } from "../../components/proceduralMap/catMeta";
import { cld } from "../../utils/cloudinary";
import { formatTurnover } from "../../utils";
import { setIsOverview } from "../../store/slices/isOverview.slice";
import placeholder from "../../assets/placeholderimg.jpg";

const CODE_TO_ID = Object.fromEntries(
  Object.entries(CAT_META).map(([k, v]) => [v.code, parseInt(k.split("-")[1])])
);

const metaByCatId = (id) => CAT_META[`category-${id}`];

// A vendor may list several websites (comma/space separated). Return clean,
// labelled links so each one is valid and clickable.
function parseWebsites(raw) {
  if (!raw || raw === "N/A" || String(raw).startsWith("N/A")) return [];
  return String(raw)
    .split(/[,\s]+/)
    .map((s) => s.trim())
    .filter((s) => s && !s.startsWith("N/A"))
    .map((s) => ({
      href: s.startsWith("http") ? s : `https://${s}`,
      label: s.replace(/^https?:\/\//, "").replace(/\/$/, ""),
    }));
}

// ── Icons ──
const I = {
  founded:   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>,
  employees: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  hq:        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
  globe:     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
  turnover:  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
  arrow:     <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>,
  external:  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"/></svg>,
};

export default function CompanyPageClient({ companyId, initialCompany, subcategoryNames = [], countryNames = [], qa = [] }) {
  const isOverview = useSelector((s) => s.isOverview);
  const dispatch   = useDispatch();
  const company    = initialCompany;
  const [seeAll,   setSeeAll] = useState(false);

  // Names resolved server-side (SSR'd) — no client fetch, good for SEO
  const subcategories = subcategoryNames;
  const countries     = countryNames;

  // Categories from CAT_META (no API call) → badges
  const categories = (company?.companyCategories ?? [])
    .filter((id, i, arr) => arr.indexOf(id) === i)
    .map(metaByCatId)
    .filter(Boolean);

  const mainMeta = company?.maincategory?.[0] ? metaByCatId(company.maincategory[0]) : null;
  const websites = parseWebsites(company?.companyWebsite);
  const offices  = company?.companyOffices ?? [];

  const compareHref = () => {
    if (mainMeta) sessionStorage.setItem("comparePreCategoryId", CODE_TO_ID[mainMeta.code]);
  };

  const facts = [
    company?.creationDate && { icon: I.founded, label: "Founded", value: company.creationDate },
    company?.employees    && { icon: I.employees, label: "Employees", value: company.employees },
    company?.location     && { icon: I.hq, label: "Headquarters", value: company.location },
    offices.length > 0    && { icon: I.globe, label: "Active in", value: `${offices.length} countries` },
  ].filter(Boolean);

  return (
    <div className={styles.page}>
      <Navbar buttonLabel="Log In" />

      <div className={styles.container}>
        {/* Breadcrumb */}
        <nav className={styles.breadcrumb} aria-label="Breadcrumb">
          <a href="/">TreasuryMap</a>
          {mainMeta && (
            <>
              <span className={styles.sep}>›</span>
              <a href={`/?category=${mainMeta.code}`}>{mainMeta.code}</a>
            </>
          )}
          <span className={styles.sep}>›</span>
          <span className={styles.current}>{company?.name}</span>
        </nav>

        {/* Hero */}
        <header className={styles.hero}>
          <div className={styles.heroLogo}>
            <img
              src={company?.logo ? cld(company.logo, { w: 360 }) : placeholder.src}
              alt={company?.name ? `${company.name} logo` : "Company logo"}
            />
          </div>
          <div className={styles.heroBody}>
            <h1 className={styles.heroName}>{company?.name}</h1>

            {categories.length > 0 && (
              <div className={styles.badges}>
                {categories.map((c) => (
                  <a
                    key={c.code}
                    href={`/?category=${c.code}`}
                    className={styles.badge}
                    style={{
                      background: `hsl(${c.hue},70%,95%)`,
                      color: `hsl(${c.hue},55%,30%)`,
                      borderColor: `hsl(${c.hue},50%,84%)`,
                    }}
                    title={c.full}
                  >
                    <span className={styles.badgeDot} style={{ background: `hsl(${c.hue},72%,50%)` }} />
                    {c.code}
                  </a>
                ))}
              </div>
            )}

            {facts.length > 0 && (
              <div className={styles.facts}>
                {facts.map((f, i) => (
                  <div key={i} className={styles.fact}>
                    <span className={styles.factIcon}>{f.icon}</span>
                    <span className={styles.factText}>
                      <span className={styles.factLabel}>{f.label}</span>
                      <span className={styles.factValue}>{f.value}</span>
                    </span>
                  </div>
                ))}
              </div>
            )}

            <div className={styles.heroCtas}>
              {websites[0] && (
                <a href={websites[0].href} target="_blank" rel="noopener noreferrer" className={styles.btnPrimary}>
                  Visit website {I.external}
                </a>
              )}
              {mainMeta && (
                <a href="/compare-tools" onClick={compareHref} className={styles.btnSecondary}>
                  Compare in {mainMeta.code} {I.arrow}
                </a>
              )}
            </div>
          </div>
        </header>
      </div>

      {/* Sticky tabs */}
      <div className={styles.tabsWrap}>
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${isOverview ? styles.tabActive : ""}`}
            onClick={() => dispatch(setIsOverview(true))}
            aria-pressed={isOverview}
          >
            Overview
          </button>
          <button
            className={`${styles.tab} ${!isOverview ? styles.tabActive : ""}`}
            onClick={() => dispatch(setIsOverview(false))}
            aria-pressed={!isOverview}
          >
            Media Zone
          </button>
        </div>
      </div>

      {/* Content */}
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.main}>
            {isOverview
              ? <Overview companyId={companyId} initialCompany={company} qa={qa} />
              : <MediaZone companyId={companyId} />}
          </div>

          {/* Side: key facts + subcategories + active in */}
          <aside className={styles.side}>
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>Key facts</h2>
              {company?.creationDate && <div className={styles.kfRow}><span className={styles.kfLabel}>Founded</span><span className={styles.kfValue}>{company.creationDate}</span></div>}
              {company?.employees    && <div className={styles.kfRow}><span className={styles.kfLabel}>Employees</span><span className={styles.kfValue}>{company.employees}</span></div>}
              {company?.showTurnover && company?.turnover && Number(company.turnover) !== 0 &&
                <div className={styles.kfRow}><span className={styles.kfLabel}>Turnover</span><span className={styles.kfValue}>{formatTurnover(company.turnover)}</span></div>}
              {company?.location     && <div className={styles.kfRow}><span className={styles.kfLabel}>Headquarters</span><span className={styles.kfValue}>{company.location}</span></div>}
              {company?.productName  && <div className={styles.kfRow}><span className={styles.kfLabel}>Product</span><span className={styles.kfValue}>{company.productName}</span></div>}
              {websites.map((w, i) => (
                <a key={i} href={w.href} target="_blank" rel="noopener noreferrer" className={styles.websiteBtn}
                   style={{ marginTop: i === 0 ? 14 : 8, width: "100%", justifyContent: "center" }}>
                  {w.label} {I.external}
                </a>
              ))}
            </div>

            {subcategories.length > 0 && (
              <div className={styles.card}>
                <h2 className={styles.cardTitle}>Sub-categories</h2>
                <div className={styles.chips}>
                  {subcategories.map((s, i) => <span key={i} className={styles.chip}>{s}</span>)}
                </div>
              </div>
            )}

            {countries.length > 0 && (
              <div className={styles.card}>
                <h2 className={styles.cardTitle}>Active in</h2>
                <div className={styles.countries}>
                  {(seeAll ? countries : countries.slice(0, 8)).map((c, i) => (
                    <span key={i} className={styles.countryChip}>{c}</span>
                  ))}
                </div>
                {countries.length > 8 && (
                  <button className={styles.seeMore} onClick={() => setSeeAll(!seeAll)}>
                    {seeAll ? "See less" : `See all ${countries.length}`}
                  </button>
                )}
              </div>
            )}
          </aside>
        </div>

        {/* Treasurer CTA */}
        <div className={styles.ctaTreasurer}>
          <h3>Building your shortlist?</h3>
          <p>Get an AI-curated Long List matched to your treasury profile, or compare vendors side-by-side.</p>
          <div className={styles.ctaTreasurerBtns}>
            <a href="/get-my-list" className={styles.ctaWhiteBtn}>Get my Long List {I.arrow}</a>
            {mainMeta && (
              <a href="/compare-tools" onClick={compareHref} className={styles.ctaGhostBtn}>
                Compare in {mainMeta.code} {I.arrow}
              </a>
            )}
          </div>
        </div>

        {/* Provider CTA */}
        <p className={styles.ctaProvider}>
          Is this your company? <a href="/signup">Claim or update this profile →</a>
        </p>
      </div>

      <Footer />
    </div>
  );
}

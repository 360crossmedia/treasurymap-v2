"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import styles from "../styles/Insights.module.css";
import InsightsCard from "./InsightsCard";
import { truncateHtmlString } from "../utils";
import { publicationHref } from "../utils/slugify";
import { coverImg, coverImgFull } from "../utils/cloudinary";
import { url } from "../service/url";
import { apiGetFullMainPublications } from "../service/apiGetFullMainPublications";
import NewsletterForm from "./NewsletterForm";

const Insights = ({ initialPubs = null, initialCompanyById = {} }) => {
  // Seed from the server-rendered list when present (SSR/SEO); otherwise null
  // shows the skeleton and the client fetch below runs (fallback / recovery).
  const hasInitial = Array.isArray(initialPubs) && initialPubs.length > 0;
  const [pubs, setPubs]   = useState(hasInitial ? initialPubs : null);
  const [error, setError] = useState(false);
  const [companyById, setCompanyById] = useState(initialCompanyById); // companyId -> name (for SEO URLs)
  const [query, setQuery] = useState(""); // client-side search over the loaded list

  useEffect(() => {
    if (hasInitial) return; // server already provided the data
    let cancelled = false;
    (async () => {
      try {
        const [featured, all, companies] = await Promise.all([
          apiGetFullMainPublications(),
          axios.get(`${url}/api/v1/publications`).then((r) => r.data).catch(() => []),
          axios.get(`${url}/api/v1/companies`).then((r) => r.data).catch(() => []),
        ]);
        if (cancelled) return;
        setCompanyById(Object.fromEntries((companies || []).map((c) => [c.id, c.name])));
        // Featured (in the admin-chosen slot order) come FIRST, then everything
        // else newest-first. So Publications control actually drives the top.
        const key = (p) => `${p.url ? "v" : "a"}-${p.id}`;
        const seen = new Set();
        const orderedFeatured = [];
        for (const p of featured || []) {
          if (!p || !p.coverImage || seen.has(key(p))) continue;
          seen.add(key(p));
          orderedFeatured.push(p);
        }
        const rest = (all || [])
          .filter((p) => p && p.coverImage && !seen.has(key(p)))
          .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        setPubs([...orderedFeatured, ...rest]);
      } catch {
        if (!cancelled) setError(true);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // Loading skeleton
  if (pubs === null && !error) {
    return (
      <div className={styles.container}>
        <div className={styles.heroSkel} />
        <div className={styles.skeletonGrid}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className={styles.skel}>
              <div className={styles.skelCover} />
              <div className={styles.skelLine} />
              <div className={`${styles.skelLine} ${styles.skelLineShort}`} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error || !pubs?.length) {
    return (
      <div className={styles.container}>
        <NewsletterForm variant="banner" />
        <div className={styles.empty}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#c0c8d8" strokeWidth="1.5">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
          </svg>
          <p>{error ? "Couldn't load insights. Please try again later." : "No insights published yet."}</p>
        </div>
      </div>
    );
  }

  const hero = pubs[0];
  const rest = pubs.slice(1);
  const heroVideo = !!hero.url;
  const heroHref = publicationHref(hero, companyById[hero.companyId]);

  // Client-side search: match title, provider name and the excerpt/body text.
  const q = query.trim().toLowerCase();
  const searching = q.length > 0;
  const matches = (p) => {
    const hay = [p.title, companyById[p.companyId], p.introduction, p.body]
      .filter(Boolean).join(" ").replace(/<[^>]+>/g, " ").toLowerCase();
    return hay.includes(q);
  };
  const results = searching ? pubs.filter(matches) : [];

  return (
    <div className={styles.container}>
      <NewsletterForm variant="banner" />

      {/* Search bar */}
      <div className="ins-search">
        <svg className="ins-search-ic" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search insights, providers, topics…"
          aria-label="Search insights"
        />
        {searching && (
          <button className="ins-search-clear" onClick={() => setQuery("")} aria-label="Clear search">✕</button>
        )}
      </div>

      {searching ? (
        <>
          <h3 className={styles.sectionTitle}>
            {results.length} result{results.length === 1 ? "" : "s"} for “{query.trim()}”
          </h3>
          {results.length > 0 ? (
            <div className={styles.grid}>
              {results.map((p) => (
                <InsightsCard
                  key={`${p.url ? "v" : "a"}-${p.id}`}
                  publication={p}
                  companyName={companyById[p.companyId]}
                />
              ))}
            </div>
          ) : (
            <p className={styles.empty} style={{ padding: "24px 0" }}>
              No insights match your search. Try another term.
            </p>
          )}
        </>
      ) : (
        <>
          {/* Hero · featured publication */}
          <a className={styles.hero} href={heroHref}>
            <div className={styles.heroCover} style={{ backgroundImage: `url(${coverImgFull(hero.coverImage, 900)})` }} />
            <div className={styles.heroBody}>
              <span className={styles.heroType}>{heroVideo ? "▶ Featured video" : "Featured article"}</span>
              <h2 className={styles.heroTitle}>{hero.title}</h2>
              <p className={styles.heroExcerpt}>
                {truncateHtmlString(heroVideo ? hero.introduction : (hero.body || hero.introduction || ""), 240)}
              </p>
            </div>
          </a>

          {/* Grid · the rest */}
          {rest.length > 0 && (
            <>
              <h3 className={styles.sectionTitle}>Latest insights</h3>
              <div className={styles.grid}>
                {rest.map((p) => (
                  <InsightsCard
                    key={`${p.url ? "v" : "a"}-${p.id}`}
                    publication={p}
                    companyName={companyById[p.companyId]}
                  />
                ))}
              </div>
            </>
          )}
        </>
      )}

      <style jsx>{`
        .ins-search {
          position: relative;
          max-width: 560px;
          margin: 4px auto 30px;
        }
        .ins-search-ic {
          position: absolute; left: 16px; top: 50%; transform: translateY(-50%);
          color: #8a97ad; pointer-events: none;
        }
        .ins-search input {
          width: 100%; box-sizing: border-box;
          padding: 14px 44px 14px 46px;
          border: 1px solid #dbe4f0; border-radius: 12px;
          background: #fff; color: #0e2c5c;
          font-size: 15px; font-family: inherit;
          outline: none; transition: border-color .15s, box-shadow .15s;
        }
        .ins-search input::placeholder { color: #9aa6ba; }
        .ins-search input:focus {
          border-color: #2f6fe0;
          box-shadow: 0 0 0 3px rgba(47,111,224,.14);
        }
        .ins-search-clear {
          position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
          width: 26px; height: 26px; border: none; border-radius: 50%;
          background: #eef2f8; color: #5a6a85; cursor: pointer;
          font-size: 12px; line-height: 1; display: grid; place-items: center;
          transition: background .15s, color .15s;
        }
        .ins-search-clear:hover { background: #e0e7f1; color: #0e2c5c; }
      `}</style>
    </div>
  );
};

export default Insights;

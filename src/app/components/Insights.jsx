"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import styles from "../styles/Insights.module.css";
import InsightsCard from "./InsightsCard";
import { truncateHtmlString } from "../utils";
import { publicationHref } from "../utils/slugify";
import { coverImg } from "../utils/cloudinary";
import { url } from "../service/url";
import { apiGetFullMainPublications } from "../service/apiGetFullMainPublications";

const Insights = () => {
  const [pubs, setPubs]   = useState(null); // null = loading
  const [error, setError] = useState(false);
  const [companyById, setCompanyById] = useState({}); // companyId -> name (for SEO URLs)

  useEffect(() => {
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
        // Combine featured + all, dedupe, sort newest-first.
        const merged = new Map();
        [...(featured || []), ...(all || [])].forEach((p) => {
          if (!p || !p.coverImage) return;
          merged.set(`${p.url ? "v" : "a"}-${p.id}`, p);
        });
        const sorted = [...merged.values()].sort(
          (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
        );
        setPubs(sorted);
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

  return (
    <div className={styles.container}>
      {/* Hero — featured publication */}
      <a className={styles.hero} href={heroHref}>
        <div className={styles.heroCover} style={{ backgroundImage: `url(${coverImg(hero.coverImage, 760, 520)})` }} />
        <div className={styles.heroBody}>
          <span className={styles.heroType}>{heroVideo ? "▶ Featured video" : "Featured article"}</span>
          <h2 className={styles.heroTitle}>{hero.title}</h2>
          <p className={styles.heroExcerpt}>
            {truncateHtmlString(heroVideo ? hero.introduction : (hero.body || hero.introduction || ""), 240)}
          </p>
        </div>
      </a>

      {/* Grid — the rest */}
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
    </div>
  );
};

export default Insights;

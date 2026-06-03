"use client";
import { useEffect, useState } from "react";
import styles from "../styles/Insights.module.css";
import InsightsCard from "./InsightsCard";
import { truncateHtmlString } from "../utils";
import { apiGetFullMainPublications } from "../service/apiGetFullMainPublications";

const Insights = () => {
  const [pubs, setPubs]       = useState(null); // null = loading
  const [error, setError]     = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await apiGetFullMainPublications();
        if (cancelled) return;
        setPubs(Array.isArray(data) ? data.filter((p) => p && p.coverImage) : []);
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
  const heroHref = heroVideo ? `/publication/video/${hero.id}` : `/publication/article/${hero.id}`;

  return (
    <div className={styles.container}>
      {/* Hero — featured publication */}
      <a className={styles.hero} href={heroHref}>
        <div className={styles.heroCover} style={{ backgroundImage: `url(${hero.coverImage})` }} />
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
            {rest.map((p) => <InsightsCard key={`${p.url ? "v" : "a"}-${p.id}`} publication={p} />)}
          </div>
        </>
      )}
    </div>
  );
};

export default Insights;

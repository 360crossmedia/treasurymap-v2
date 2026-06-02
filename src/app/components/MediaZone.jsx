"use client";
import styles from "../styles/ProviderPage.module.css";
import { useEffect, useState } from "react";
import { apiGetAllVideosByCompanyId } from "../service/apiGetAllVideosByCompanyId";
import { apiGetAllArticlesByCompanyId } from "../service/apiGetAllArticlesByCompanyId";
import InsightsCard from "./InsightsCard";

const MediaZone = ({ companyId }) => {
  const [videos,   setVideos]   = useState([]);
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [v, a] = await Promise.all([
          apiGetAllVideosByCompanyId(companyId),
          apiGetAllArticlesByCompanyId(companyId),
        ]);
        if (cancelled) return;
        setVideos(v ?? []);
        setArticles(a ?? []);
      } catch (err) {
        console.error("MediaZone: failed to load media", err);
      }
    })();
    return () => { cancelled = true; };
  }, [companyId]);

  const hasMedia = articles.length > 0 || videos.length > 0;

  return (
    <section className={styles.card} aria-label="Media Zone">
      <h2 className={styles.sectionH2}>Insights &amp; media</h2>
      {hasMedia ? (
        <div className={styles.mediaGrid}>
          {articles.map((article, i) => <InsightsCard key={`a-${i}`} publication={article} />)}
          {videos.map((video, i) => <InsightsCard key={`v-${i}`} publication={video} />)}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#c0c8d8" strokeWidth="1.5">
            <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>
          </svg>
          <p>No articles or videos for this vendor yet.</p>
        </div>
      )}
    </section>
  );
};

export default MediaZone;

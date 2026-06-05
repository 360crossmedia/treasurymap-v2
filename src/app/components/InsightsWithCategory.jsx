"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import styles from "../styles/Insights.module.css";
import InsightsCard from "./InsightsCard";
import { url } from "../service/url";
import { apiGetCategoryById } from "../service/apiGetCategoryById";
import { apiGetPublicationsByCategoryId } from "../service/apiGetPublicationsByCategoryId";
import { formatCategoryName } from "../utils";

const InsightsWithCategory = ({ categoryId, initialCategory = null, initialPubs = null, initialCompanyById = {} }) => {
  // Seed from the server-rendered data when present (SSR/SEO). The server always
  // passes an array (possibly empty), so the client fetch only runs as a fallback.
  const hasInitial = Array.isArray(initialPubs);
  const [category, setCategory] = useState(initialCategory);
  const [pubs, setPubs]         = useState(hasInitial ? initialPubs : null);
  const [companyById, setCompanyById] = useState(initialCompanyById);

  useEffect(() => {
    if (hasInitial) return; // server already provided the data
    let cancelled = false;
    (async () => {
      const [cat, list, companies] = await Promise.all([
        apiGetCategoryById(categoryId),
        apiGetPublicationsByCategoryId(categoryId),
        axios.get(`${url}/api/v1/companies`).then((r) => r.data).catch(() => []),
      ]);
      if (cancelled) return;
      setCategory(cat);
      setCompanyById(Object.fromEntries((companies || []).map((c) => [c.id, c.name])));
      setPubs(Array.isArray(list) ? list.filter((p) => p?.live && p?.coverImage) : []);
    })();
    return () => { cancelled = true; };
  }, [categoryId]);

  return (
    <div className={styles.container}>
      {category && (
        <h2 className={styles.sectionTitle} style={{ fontSize: "1.5rem", margin: "8px 0 22px" }}>
          {formatCategoryName(category.name)}
        </h2>
      )}

      {pubs === null ? (
        <div className={styles.skeletonGrid}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className={styles.skel}>
              <div className={styles.skelCover} />
              <div className={styles.skelLine} />
              <div className={`${styles.skelLine} ${styles.skelLineShort}`} />
            </div>
          ))}
        </div>
      ) : pubs.length === 0 ? (
        <div className={styles.empty}>
          <p>No insights in this category yet.</p>
        </div>
      ) : (
        <div className={styles.grid}>
          {pubs.map((p) => (
            <InsightsCard key={`${p.url ? "v" : "a"}-${p.id}`} publication={p} companyName={companyById[p.companyId]} />
          ))}
        </div>
      )}
    </div>
  );
};

export default InsightsWithCategory;

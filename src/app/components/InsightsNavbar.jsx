"use client";
import { useEffect, useState } from "react";
import styles from "../styles/Insights.module.css";
import { apiGetCategories } from "../service/apiGetCategories";
import { formatCategoryName } from "../utils";

const InsightsNavbar = ({ categoryId }) => {
  const [categories, setCategories] = useState([]);
  const active = categoryId ? String(categoryId) : "all";

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const res = await apiGetCategories();
      if (!cancelled) setCategories(res?.data || []);
    })();
    return () => { cancelled = true; };
  }, []);

  return (
    <div className={styles.tabsWrap}>
      <nav className={styles.tabs} aria-label="Insights categories">
        <a href="/insights" className={`${styles.tab} ${active === "all" ? styles.tabActive : ""}`}>
          All
        </a>
        {categories.map((c) => (
          <a
            key={c.id}
            href={`/insights/${c.id}`}
            className={`${styles.tab} ${active === String(c.id) ? styles.tabActive : ""}`}
          >
            {formatCategoryName(c.name)}
          </a>
        ))}
      </nav>
    </div>
  );
};

export default InsightsNavbar;

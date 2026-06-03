"use client";
import styles from "../styles/Insights.module.css";
import { truncateHtmlString } from "../utils";

const InsightsCard = ({ publication }) => {
  const p = publication || {};
  const isVideo = !!p.url;
  const href = isVideo ? `/publication/video/${p.id}` : `/publication/article/${p.id}`;
  const excerpt = isVideo
    ? truncateHtmlString(p.introduction || "", 130)
    : truncateHtmlString(p.body || p.introduction || "", 130);

  return (
    <a className={styles.card} href={href}>
      <div className={styles.cardCover} style={{ backgroundImage: `url(${p.coverImage})` }}>
        <span className={styles.typeBadge}>{isVideo ? "▶ Video" : "Article"}</span>
      </div>
      <div className={styles.cardBody}>
        <h3 className={styles.cardTitle}>{p.title}</h3>
        {excerpt && <p className={styles.cardExcerpt}>{excerpt}</p>}
      </div>
    </a>
  );
};

export default InsightsCard;

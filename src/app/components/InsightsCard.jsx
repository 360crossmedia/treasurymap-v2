"use client";
import styles from "../styles/Insights.module.css";
import { truncateHtmlString, formatDateShort } from "../utils";
import { publicationHref } from "../utils/slugify";
import { coverImg } from "../utils/cloudinary";

const InsightsCard = ({ publication, companyName }) => {
  const p = publication || {};
  const isVideo = !!p.url;
  const href = publicationHref(p, companyName);
  const excerpt = isVideo
    ? truncateHtmlString(p.introduction || "", 130)
    : truncateHtmlString(p.body || p.introduction || "", 130);

  return (
    <a className={styles.card} href={href}>
      <div className={styles.cardCover} style={{ backgroundImage: `url(${coverImg(p.coverImage, 600, 375)})` }}>
        <span className={styles.typeBadge}>{isVideo ? "▶ Video" : "Article"}</span>
      </div>
      <div className={styles.cardBody}>
        <h3 className={styles.cardTitle}>{p.title}</h3>
        {excerpt && <p className={styles.cardExcerpt}>{excerpt}</p>}
        <p className={styles.cardMeta}>
          {companyName ? <span>{companyName}</span> : null}
          {companyName && p.createdAt ? <span className={styles.cardMetaDot}>·</span> : null}
          {p.createdAt ? <span>{formatDateShort(p.createdAt)}</span> : null}
        </p>
      </div>
    </a>
  );
};

export default InsightsCard;

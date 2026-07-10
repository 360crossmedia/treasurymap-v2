"use client";
import { useState } from "react";
import styles from "../styles/ArticlePage.module.css";
import InsightsCard from "./InsightsCard";
import { providerHref, publicationHref } from "../utils/slugify";
import { sanitizeRich } from "../utils/sanitize";
import { coverImg, coverImgFull } from "../utils/cloudinary";
import { formatDate } from "../utils";

const LinkedinIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/></svg>
);
const LinkIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
);

const PublicationView = ({ publication, company, category, related = [], companyNameById = {}, isVideo }) => {
  const p = publication || {};
  const [copied, setCopied] = useState(false);

  const shareUrl =
    typeof window !== "undefined"
      ? window.location.href
      : "";

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (_) {}
  };

  const catHref = category?.id ? `/insights/${category.id}` : "/insights";
  const companyName = company?.name;

  return (
    <div className={styles.page}>
      <article className={styles.reading}>
        {/* Breadcrumb */}
        <nav className={styles.breadcrumb} aria-label="Breadcrumb">
          <a href="/">TreasuryMap</a>
          <span className={styles.sep}>›</span>
          <a href="/insights">Insights</a>
          {category?.name && (
            <>
              <span className={styles.sep}>›</span>
              <a href={catHref}>{category.name.replace(/\s*\(.*\)$/, "")}</a>
            </>
          )}
          <span className={styles.sep}>›</span>
          <span className={styles.current}>{p.title}</span>
        </nav>

        {/* Header */}
        <header className={styles.header}>
          {category?.name && (
            <a className={styles.catBadge} href={catHref}>{category.name.replace(/\s*\(.*\)$/, "")}</a>
          )}
          <h1 className={styles.title}>{p.title}</h1>
          {p.introduction && <p className={styles.intro}>{p.introduction}</p>}
        </header>

        {/* Meta + share */}
        <div className={styles.metaRow}>
          <div className={styles.author}>
            {companyName && (
              <span>
                by <a className={styles.authorLink} href={providerHref(company)}>{companyName}</a>
              </span>
            )}
            {(p.createdAt || p.updatedAt) && (
              <>
                <span className={styles.dot}>·</span>
                <span className={styles.date}>{formatDate(p.createdAt || p.updatedAt)}</span>
              </>
            )}
          </div>
          <div className={styles.share}>
            <a
              className={`${styles.shareBtn} ${styles.shareBtnLinkedin}`}
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
              target="_blank" rel="noopener noreferrer"
            >
              <LinkedinIcon /> Share
            </a>
            <button className={`${styles.shareBtn} ${copied ? styles.copied : ""}`} onClick={copyLink}>
              <LinkIcon /> {copied ? "Copied!" : "Copy link"}
            </button>
          </div>
        </div>

        {/* Cover / video */}
        {isVideo ? (
          p.url && (
            <div className={styles.videoWrap}>
              <iframe
                src={p.url}
                title={p.title || "Video"}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>
          )
        ) : (
          p.coverImage && <img className={styles.cover} src={coverImgFull(p.coverImage, 1400)} alt={p.title || "Cover"} />
        )}

        {/* Rich body · articles and videos (a video's formatted description). */}
        {p.body && (
          <div className={styles.body} dangerouslySetInnerHTML={{ __html: sanitizeRich(p.body) }} />
        )}

        <a className={styles.backLink} href="/insights">← Back to all insights</a>
      </article>

      {/* Related */}
      {related.length > 0 && (
        <section className={styles.wide}>
          <div className={styles.divider} />
          <div className={styles.relatedSection}>
            <div className={styles.relatedHead}>
              <h2 className={styles.relatedTitle}>Related insights</h2>
              {companyName && (
                <a className={styles.viewAll} href={providerHref(company)}>
                  View all from {companyName} →
                </a>
              )}
            </div>
            <div className={styles.relatedGrid}>
              {related.map((r) => (
                <InsightsCard
                  key={`${r.url ? "v" : "a"}-${r.id}`}
                  publication={r}
                  companyName={companyNameById[r.companyId]}
                />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default PublicationView;

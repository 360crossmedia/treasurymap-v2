import React from "react";
import styles from "../styles/Insights.module.css";
import { formatDate, truncateHtmlString } from "../utils";

const InsightsRowOfArticles = ({ publications }) => {
  const handleHref = (index) => {
    if (publications?.[index]?.url) {
      return `/publication/video/${publications?.[index]?.id}`;
    } else {
      return `/publication/article/${publications?.[index]?.id}`;
    }
  };
  return (
    <div className={styles.articlesContainer}>
      {publications.length > 0 && (
        <div className={styles.bigArticle}>
          <a className={styles.link} href={handleHref(0)}>
            <div
              className={styles.cardImageContainer}
              style={{
                backgroundImage: `url(${publications?.[0]?.coverImage})`,
              }}
            ></div>
          </a>
          <a className={styles.link} href={handleHref(0)}>
            <h4 className={`${styles.mainTitle} ${styles.bold}`}>
              {publications?.[0]?.title}
            </h4>
          </a>
          <p>{`${formatDate(publications?.[0]?.createdAt)} | ${
            publications?.[0]?.url ? "Video" : "Article"
          }`}</p>
        </div>
      )}
      <div className={styles.smallArticlesContainer}>
        {publications?.[1]?.coverImage && (
          <div className={styles.smallArticle}>
            <a className={styles.link} href={handleHref(1)}>
              <div
                className={styles.smallCardImageContainer}
                style={{
                  backgroundImage: `url(${publications?.[1]?.coverImage})`,
                }}
              ></div>
            </a>
            <a className={styles.link} href={handleHref(1)}>
              <h6 className={`${styles.mainTitle} ${styles.bold}`}>
                {publications?.[1]?.title}
              </h6>
            </a>
            <p className={styles.secondaryArticleBody}>
              {truncateHtmlString(publications?.[1]?.body, 220)}
            </p>
          </div>
        )}
        {publications?.[2]?.coverImage && (
          <div className={styles.smallArticle}>
            <a className={styles.link} href={handleHref(2)}>
              <div
                className={styles.smallCardImageContainer}
                style={{
                  backgroundImage: `url(${publications?.[2]?.coverImage})`,
                }}
              ></div>
            </a>
            <a className={styles.link} href={handleHref(2)}>
              <h6 className={`${styles.mainTitle} ${styles.bold}`}>
                {publications?.[2]?.title}
              </h6>
            </a>
            <p className={styles.secondaryArticleBody}>
              {truncateHtmlString(publications?.[2]?.body, 220)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InsightsRowOfArticles;

import React from "react";
import styles from "../styles/Insights.module.css";
import { formatDate, truncateHtmlString } from "../utils";
import { useRouter } from "next/navigation";

const InsightsRowOfArticles = ({ publications }) => {
  const router = useRouter();

  const handleOnClick = (isMainPublication, index) => {
    if (!isMainPublication) {
      router.push(
        publications?.[index]?.url
          ? `/publication/video/${publications?.[index]?.id}`
          : `/publication/article/${publications?.[index]?.id}`
      );
    }
  };

  return (
    <div className={styles.articlesContainer}>
      {publications.length > 0 && (
        <div className={styles.bigArticle}>
          <div
            onClick={() => handleOnClick(false, 0)}
            className={styles.cardImageContainer}
            style={{
              backgroundImage: `url(${publications?.[0]?.coverImage})`,
            }}
          ></div>
          <h4
            onClick={() => handleOnClick(false, 0)}
            className={`${styles.mainTitle} ${styles.bold}`}
          >
            {publications?.[0]?.title}
          </h4>
          <p>{`${formatDate(publications?.[0]?.createdAt)} | ${
            publications?.[0]?.url ? "Video" : "Article"
          }`}</p>
        </div>
      )}
      <div className={styles.smallArticlesContainer}>
        {publications?.[1]?.coverImage && (
          <div className={styles.smallArticle}>
            <div
              onClick={() => handleOnClick(false, 1)}
              className={styles.smallCardImageContainer}
              style={{
                backgroundImage: `url(${publications?.[1]?.coverImage})`,
              }}
            ></div>
            <h6
              onClick={() => handleOnClick(false, 1)}
              className={`${styles.mainTitle} ${styles.bold}`}
            >
              {publications?.[1]?.title}
            </h6>
            <p className={styles.secondaryArticleBody}>
              {truncateHtmlString(publications?.[1]?.body, 220)}
            </p>
          </div>
        )}
        {publications?.[2]?.coverImage && (
          <div className={styles.smallArticle}>
            <div
              onClick={() => handleOnClick(false, 2)}
              className={styles.smallCardImageContainer}
              style={{
                backgroundImage: `url(${publications?.[2]?.coverImage})`,
              }}
            ></div>
            <h6
              onClick={() => handleOnClick(false, 2)}
              className={`${styles.mainTitle} ${styles.bold}`}
            >
              {publications?.[2]?.title}
            </h6>
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

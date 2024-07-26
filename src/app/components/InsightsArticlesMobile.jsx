"use client";
import { useRouter } from "next/navigation";
import styles from "../styles/Insights.module.css";
import { formatDate, truncateHtmlString } from "../utils";
import InsightsCard from "./InsightsCard";

const InsightsArticlesMobile = ({ publications }) => {
  const router = useRouter();
  return (
    <>
      <div className={styles.line2}></div>
      <div className={styles.articlesContainer}>
        <div
          onClick={() =>
            router.push(
              publications[1]?.url
                ? `/publication/video/${publications[1]?.id}`
                : `/publication/article/${publications[1]?.id}`
            )
          }
          className={styles.bigArticle}
        >
          <div
            onClick={() =>
              handleOnClick(publications?.[1]?.url, publications?.[1]?.id)
            }
            className={styles.smallCardImageContainer}
            style={{
              backgroundImage: `url(${publications?.[1]?.coverImage})`,
            }}
          ></div>

          <h4 className={`${styles.mainTitle} ${styles.bold}`}>
            {truncateHtmlString(publications?.[1]?.title, 50)}
          </h4>
          <p>{`${formatDate(publications?.[1]?.createdAt)} | ${
            publications?.[1]?.url ? "Video" : "Article"
          }`}</p>
        </div>
        <div
          onClick={() =>
            router.push(
              publications[2]?.url
                ? `/publication/video/${publications[2]?.id}`
                : `/publication/article/${publications[2]?.id}`
            )
          }
          className={styles.bigArticle}
        >
          <div
            onClick={() =>
              handleOnClick(publications?.[2]?.url, publications?.[2]?.id)
            }
            className={styles.smallCardImageContainer}
            style={{
              backgroundImage: `url(${publications?.[2]?.coverImage})`,
            }}
          ></div>

          <h4 className={`${styles.mainTitle} ${styles.bold}`}>
            {publications?.[2]?.title}
          </h4>
          <p>{`${formatDate(publications?.[0]?.createdAt)} | ${
            publications?.[2]?.url ? "Video" : "Article"
          }`}</p>
        </div>
      </div>
      <div className={styles.line2}></div>
      <InsightsCard publication={publications?.[3]} />
      <InsightsCard publication={publications?.[4]} />
      <InsightsCard publication={publications?.[5]} />
      <InsightsCard publication={publications?.[6]} />
    </>
  );
};

export default InsightsArticlesMobile;

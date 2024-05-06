import { useRouter } from "next/navigation";
import styles from "../styles/Insights.module.css";
import stylesWithCat from "../styles/InsightsWithCategory.module.css";
import { formatDate, truncateHtmlString } from "../utils";
import Image from "next/image";
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
              publications[0]?.url
                ? `/publication/video/${publications[0]?.id}`
                : `/publication/article/${publications[0]?.id}`
            )
          }
          className={styles.bigArticle}
        >
          <Image
            width={500}
            height={280}
            className={styles.bigArticleImage}
            src={publications?.[0]?.coverImage}
          />
          <h4 className={`${styles.mainTitle} ${styles.bold}`}>
            {truncateHtmlString(publications?.[0]?.title, 50)}
          </h4>
          <p>{`${formatDate(publications?.[0]?.createdAt)} | ${
            publications?.[0]?.url ? "Video" : "Article"
          }`}</p>
        </div>
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
          <Image
            width={500}
            height={280}
            className={styles.bigArticleImage}
            src={publications?.[1]?.coverImage}
          />
          <h4 className={`${styles.mainTitle} ${styles.bold}`}>
            {publications?.[1]?.title}
          </h4>
          <p>{`${formatDate(publications?.[0]?.createdAt)} | ${
            publications?.[1]?.url ? "Video" : "Article"
          }`}</p>
        </div>
      </div>
      <div className={styles.line2}></div>
      <InsightsCard publication={publications?.[2]} />
      <InsightsCard publication={publications?.[3]} />
      <InsightsCard publication={publications?.[4]} />
      <InsightsCard publication={publications?.[5]} />
    </>
  );
};

export default InsightsArticlesMobile;

import styles from "../styles/Insights.module.css";
import Cards from "./Cards";

const Insights = () => {
  return (
    <div className={styles.mainContainer}>
      <div className={styles.leftContainer}>
        <iframe
          width="100%"
          height="800px"
          src="https://www.youtube.com/embed/VYBfQsZ_FsY?si=wAgYSZZjWKI2TtcA"
          title="YouTube video player"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerpolicy="strict-origin-when-cross-origin"
          allowfullscreen
        ></iframe>
        <div className={styles.articlesContainer}>
          <div className={styles.bigArticle}></div>
          <div className={styles.smallArticlesContainer}>
            <div className={styles.smallArticle}></div>
            <div className={styles.smallArticle}></div>
          </div>
        </div>
        <div className={styles.articlesContainer}>
          <div className={styles.bigArticle}></div>
          <div className={styles.smallArticlesContainer}>
            <div className={styles.smallArticle}></div>
            <div className={styles.smallArticle}></div>
          </div>
        </div>
      </div>
      <div className={styles.rightContainer}>
        <Cards />
      </div>
    </div>
  );
};

export default Insights;

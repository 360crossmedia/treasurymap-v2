"use client";
import styles from "../styles/Insights.module.css";
import { formatDate } from "../utils";

const SinglePublicationAside = ({ publication }) => {
  const handleHref = (publication) => {
    if (publication?.url) {
      return `/publication/video/${publication?.id}`;
    } else {
      return `/publication/article/${publication?.id}`;
    }
  };
  return (
    <div className={styles.card}>
      <a className={styles.link} href={handleHref(publication)}>
        <div
          className={styles.cardImageContainer}
          style={{
            backgroundImage: `url(${publication?.coverImage})`,
          }}
          onClick={() => handleOnClick(publication?.url, publication?.id)}
        ></div>
      </a>
      <div>
        <a className={styles.link} href={handleHref(publication)}>
          <h4
            onClick={() => handleOnClick(publication?.url, publication?.id)}
            className={styles.mainTitle}
          >
            {publication?.title}
          </h4>
        </a>
        <p className={styles.articleDate}>
          {`${formatDate(publication?.createdAt)} ${
            publication?.url ? "| Video" : "| Article"
          }`}
        </p>
      </div>
    </div>
  );
};

export default SinglePublicationAside;

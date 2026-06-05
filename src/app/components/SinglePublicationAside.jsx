"use client";
import styles from "../styles/Insights.module.css";
import { formatDate } from "../utils";
import { publicationHref } from "../utils/slugify";

const SinglePublicationAside = ({ publication }) => {
  const handleHref = (publication) => publicationHref(publication);
  return (
    <div className={styles.card}>
      <a className={styles.link} href={handleHref(publication)}>
        <div
          className={styles.cardImageContainer}
          style={{
            backgroundImage: `url(${publication?.coverImage})`,
          }}
        ></div>
      </a>
      <div>
        <a className={styles.link} href={handleHref(publication)}>
          <h4 className={styles.mainTitle}>{publication?.title}</h4>
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

"use client";
import { formatDate } from "../utils";
import styles from "../styles/Insights.module.css";
import { publicationHref } from "../utils/slugify";

const DoublePublicationAside = ({ publications }) => {
  const handleHref = (index) => publicationHref(publications?.[index]);
  return (
    <div className={styles.twoCards}>
      <div className={styles.miniCard}>
        <a className={styles.link} href={handleHref(0)}>
          <div
            className={styles.miniCardImageContainer}
            style={{
              backgroundImage: `url(${publications?.[0]?.coverImage})`,
            }}
            onClick={() =>
              handleOnClick(publications?.[0]?.url, publications?.[0]?.id)
            }
          ></div>
        </a>
        <div>
          <a className={styles.link} href={handleHref(0)}>
            <h6 className={`${styles.mainTitle} ${styles.bold}`}>
              {publications?.[0]?.title}
            </h6>
          </a>
          <p className={styles.articleDate}>
            {`${formatDate(publications?.[0]?.createdAt)} ${
              publications?.[0]?.url ? "| Video" : "| Article"
            }`}
          </p>
        </div>
      </div>
      {publications?.[1] && (
        <div className={styles.miniCard}>
          <a className={styles.link} href={handleHref(1)}>
            <div
              className={styles.miniCardImageContainer}
              style={{
                backgroundImage: `url(${publications?.[1]?.coverImage})`,
              }}
            ></div>
          </a>
          <div>
            <a className={styles.link} href={handleHref(1)}>
              <h6 className={`${styles.mainTitle} ${styles.bold}`}>
                {publications?.[1]?.title}
              </h6>
            </a>
            <p className={styles.articleDate}>
              {`${formatDate(publications?.[1]?.createdAt)} ${
                publications?.[1]?.url ? "| Video" : "| Article"
              }`}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoublePublicationAside;

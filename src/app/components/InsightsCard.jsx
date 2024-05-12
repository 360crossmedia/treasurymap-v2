import React from "react";
import styles from "../styles/InsightsWithCategory.module.css";
import { usePathname } from "next/navigation";
import { truncateHtmlString } from "../utils";

const InsightsCard = ({ publication }) => {
  const pathname = usePathname();

  const handleHref = (publication) => {
    if (publication?.url) {
      return `/publication/video/${publication?.id}`;
    } else {
      return `/publication/article/${publication?.id}`;
    }
  };
  return (
    <div
      className={styles.card}
      style={
        pathname == "/insights"
          ? { flexDirection: "row-reverse", gap: "20px" }
          : {}
      }
    >
      <div className={styles.cardData}>
        <a className={styles.link} href={handleHref(publication)}>
          <h5 className={styles.title}>{publication?.title}</h5>
        </a>
        <p className={styles.description}>
          {pathname != "/insights"
            ? publication.url
              ? publication?.introduction
              : truncateHtmlString(publication?.body, 300)
            : ""}
          {pathname == "/insights"
            ? publication?.url
              ? truncateHtmlString(publication?.introduction, 100)
              : truncateHtmlString(publication?.body, 100)
            : ""}
        </p>
        <p className={styles.metadata}>
          By 360Crossmedia | April 26, 2024 | Business / Finance |
          {publication?.url ? " Video" : " Article"}
        </p>
      </div>
      <a className={styles.link} href={handleHref(publication)}>
        <div
          className={styles.cardImageContainer}
          style={{
            backgroundImage: `url(${publication?.coverImage})`,
          }}
        ></div>
      </a>
    </div>
  );
};

export default InsightsCard;

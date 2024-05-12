import React from "react";
import styles from "../styles/InsightsWithCategory.module.css";
import { usePathname, useRouter } from "next/navigation";
import { truncateHtmlString } from "../utils";

const InsightsCard = ({ publication }) => {
  const router = useRouter();
  const pathname = usePathname();

  const handleOnClick = (isVideo, publicationId) => {
    if (isVideo) router.push(`/publication/video/${publicationId}`);
    else router.push(`/publication/article/${publicationId}`);
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
        <h5
          onClick={() => handleOnClick(publication?.url, publication?.id)}
          className={styles.title}
        >
          {publication?.title}
        </h5>
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
      <div
        onClick={() => handleOnClick(publication?.url, publication?.id)}
        className={styles.cardImageContainer}
        style={{
          backgroundImage: `url(${publication?.coverImage})`,
        }}
      ></div>
    </div>
  );
};

export default InsightsCard;

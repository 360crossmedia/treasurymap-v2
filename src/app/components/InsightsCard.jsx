import React from "react";
import styles from "../styles/InsightsWithCategory.module.css";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { truncateHtmlString } from "../utils";

const InsightsCard = ({ publication }) => {
  const router = useRouter();
  const pathname = usePathname();
  const test =
    "The world’s biggest investor, Blackrock, bided its time: Blowing hot and cold over the relevance of cryptocurrencies. It watched from the sidelines as the market matured from a narrow interest among “amateur” enthusiasts and crooks. Now, the launch of its well-received cryptocurrency…";
  return (
    <div
      onClick={() =>
        router.push(
          publication.url
            ? `/publication/video/${publication.id}`
            : `/publication/article/${publication.id}`
        )
      }
      className={styles.card}
      style={
        pathname == "/insights"
          ? { flexDirection: "row-reverse", gap: "20px" }
          : {}
      }
    >
      <div className={styles.cardData}>
        <h5 className={styles.title}>{publication.title}</h5>
        <p className={styles.description}>
          {pathname != "/insights"
            ? publication.url
              ? test
              : truncateHtmlString(publication.body, 300)
            : ""}
          {pathname == "/insights"
            ? publication.url
              ? truncateHtmlString(test, 100)
              : truncateHtmlString(publication.body, 100)
            : ""}
        </p>
        <p className={styles.metadata}>
          By 360Crossmedia | April 26, 2024 | Business / Finance |
          {publication.url ? " Video" : " Article"}
        </p>
      </div>
      <div>
        <Image
          className={styles.cardCoverImage}
          width={260}
          height={174}
          src={publication.coverImage}
        />
      </div>
    </div>
  );
};

export default InsightsCard;

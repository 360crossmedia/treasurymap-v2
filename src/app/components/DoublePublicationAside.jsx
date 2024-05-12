import { useRouter } from "next/navigation";
import { formatDate } from "../utils";
import styles from "../styles/Insights.module.css";

const DoublePublicationAside = ({ publications }) => {
  const router = useRouter();

  const handleOnClick = (isVideo, publicationId) => {
    if (isVideo) router.push(`/publication/video/${publicationId}`);
    else router.push(`/publication/article/${publicationId}`);
  };
  return (
    <div className={styles.twoCards}>
      <div className={styles.miniCard}>
        <div
          className={styles.miniCardImageContainer}
          style={{
            backgroundImage: `url(${publications?.[0]?.coverImage})`,
          }}
          onClick={() =>
            handleOnClick(publications?.[0]?.url, publications?.[0]?.id)
          }
        ></div>
        <div>
          <h6
            onClick={() =>
              handleOnClick(publications?.[0]?.url, publications?.[0]?.id)
            }
            className={`${styles.mainTitle} ${styles.bold}`}
          >
            {publications?.[0]?.title}
          </h6>
          <p className={styles.articleDate}>
            {`${formatDate(publications?.[0]?.createdAt)} ${
              publications?.[0]?.url ? "| Video" : "| Article"
            }`}
          </p>
        </div>
      </div>
      {publications?.[1] && (
        <div className={styles.miniCard}>
          <div
            className={styles.miniCardImageContainer}
            style={{
              backgroundImage: `url(${publications?.[1]?.coverImage})`,
            }}
            onClick={() =>
              handleOnClick(publications?.[1]?.url, publications?.[1]?.id)
            }
          ></div>
          <div>
            <h6
              onClick={() =>
                handleOnClick(publications?.[1]?.url, publications?.[1]?.id)
              }
              className={`${styles.mainTitle} ${styles.bold}`}
            >
              {publications?.[1]?.title}
            </h6>
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

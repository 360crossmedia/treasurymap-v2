import styles from "../styles/Insights.module.css";
import { useRouter } from "next/navigation";
import { formatDate } from "../utils";

const SinglePublicationAside = ({ publication }) => {
  const router = useRouter();

  const handleOnClick = (isVideo, publicationId) => {
    if (isVideo) router.push(`/publication/video/${publicationId}`);
    else router.push(`/publication/article/${publicationId}`);
  };
  return (
    <div className={styles.card}>
      <div
        className={styles.cardImageContainer}
        style={{
          backgroundImage: `url(${publication?.coverImage})`,
        }}
        onClick={() => handleOnClick(publication?.url, publication?.id)}
      ></div>
      <div>
        <h4
          onClick={() => handleOnClick(publication?.url, publication?.id)}
          className={styles.mainTitle}
        >
          {publication?.title}
        </h4>
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

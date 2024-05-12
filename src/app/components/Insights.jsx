import styles from "../styles/Insights.module.css";
import Cards from "./Cards";
import { useEffect, useState } from "react";
import { apiGetLatestPublications } from "../service/apiGetLatestPublications";
import { apiGetMainPublication } from "../service/apiGetMainPublication";
import { useDispatch } from "react-redux";
import { setIsLoading } from "../store/slices/isLoading.slice";
import { apiGetArticleById } from "../service/apiGetArticleById";
import { apiGetVideoById } from "../service/apiGetVideoById";
import { useRouter } from "next/navigation";
import InsightsArticlesMobile from "./InsightsArticlesMobile";
import InsightsRowOfArticles from "./InsightsRowOfArticles";

const Insights = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [publications, setPublications] = useState([]);
  const [mainPublication, setMainPublication] = useState();

  useEffect(() => {
    getAllPublications();
  }, []);

  const getAllPublications = async () => {
    dispatch(setIsLoading(true));
    const publications = await apiGetLatestPublications();
    const mainPublication = await apiGetMainPublication();
    setPublications(publications);
    if (mainPublication?.isArticle) {
      const article = await apiGetArticleById(mainPublication?.publicationId);
      setMainPublication(article);
    } else {
      const video = await apiGetVideoById(mainPublication?.publicationId);
      setMainPublication(video);
    }
    if (mainPublication?.coverImage) dispatch(setIsLoading(false));
  };

  const handleOnClick = (isMainPublication, index) => {
    if (!isMainPublication) {
      router.push(
        publications?.[index]?.url
          ? `/publication/video/${publications?.[index]?.id}`
          : `/publication/article/${publications?.[index]?.id}`
      );
    } else {
      router.push(
        mainPublication?.url
          ? `/publication/video/${mainPublication?.id}`
          : `/publication/article/${mainPublication?.id}`
      );
    }
  };

  if (mainPublication?.coverImage)
    return (
      <div className={styles.mainContainer}>
        <div className={styles.leftContainer}>
          <div>
            <a
              href={
                mainPublication?.url
                  ? `/publication/video/${mainPublication?.id}`
                  : `/publication/article/${mainPublication?.id}`
              }
            >
              <div
                className={styles.mainPublicationImageContainer}
                style={{
                  backgroundImage: `url(${mainPublication?.coverImage})`,
                }}
              ></div>
            </a>
            <a
              href={
                mainPublication?.url
                  ? `/publication/video/${mainPublication?.id}`
                  : `/publication/article/${mainPublication?.id}`
              }
            >
              <h2 className={styles.mainTitle}>{mainPublication?.title}</h2>
            </a>
            <p>
              By 360Crossmedia | Bussines / Tech |
              {mainPublication?.url ? " Video" : " Article"}
            </p>
          </div>
          <div className={styles.articlesMainContainer}>
            <div className={styles.line2}></div>
            {publications.length > 0 && (
              <InsightsRowOfArticles publications={publications} />
            )}
            {publications.length > 3 && (
              <>
                <div className={styles.line2}></div>
                <InsightsRowOfArticles
                  publications={[
                    publications?.[3],
                    publications?.[4],
                    publications?.[5],
                  ]}
                />
              </>
            )}
            {publications.length > 6 && (
              <>
                <div className={styles.line2}></div>
                <InsightsRowOfArticles
                  publications={[
                    publications?.[6],
                    publications?.[7],
                    publications?.[8],
                  ]}
                />
              </>
            )}
            {publications.length > 9 && (
              <>
                <div className={styles.line2}></div>
                <InsightsRowOfArticles
                  publications={[
                    publications?.[9],
                    publications?.[10],
                    publications?.[11],
                  ]}
                />
              </>
            )}
            {publications.length > 12 && (
              <>
                <div className={styles.line2}></div>
                <InsightsRowOfArticles
                  publications={[
                    publications?.[12],
                    publications?.[13],
                    publications?.[14],
                  ]}
                />
              </>
            )}
          </div>
          <div className={styles.articlesMainContainerMobile}>
            <InsightsArticlesMobile publications={publications} />
          </div>
        </div>
        <div className={styles.line}></div>
        <div className={styles.rightContainer}>
          <Cards />
        </div>
      </div>
    );
};

export default Insights;

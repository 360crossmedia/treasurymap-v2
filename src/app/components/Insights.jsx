import Image from "next/image";
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
import { formatDate, truncateHtmlString } from "../utils";
import InsightsArticlesMobile from "./InsightsArticlesMobile";

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
            <div
              onClick={() => handleOnClick(true)}
              className={styles.mainPublicationImageContainer}
              style={{
                backgroundImage: `url(${mainPublication?.coverImage})`,
              }}
            ></div>
            <h2
              onClick={() => handleOnClick(true)}
              className={styles.mainTitle}
            >
              {mainPublication?.title}
            </h2>
            <p>
              By 360Crossmedia | Bussines / Tech |
              {mainPublication?.url ? " Video" : " Article"}
            </p>
          </div>
          <div className={styles.articlesMainContainer}>
            <div className={styles.line2}></div>
            <div className={styles.articlesContainer}>
              <div className={styles.bigArticle}>
                <div
                  onClick={() => handleOnClick(false, 0)}
                  className={styles.cardImageContainer}
                  style={{
                    backgroundImage: `url(${publications?.[0]?.coverImage})`,
                  }}
                ></div>
                <h4
                  onClick={() => handleOnClick(false, 0)}
                  className={`${styles.mainTitle} ${styles.bold}`}
                >
                  {publications?.[0]?.title}
                </h4>
                <p>{`${formatDate(publications?.[0]?.createdAt)} | ${
                  publications?.[0]?.url ? "Video" : "Article"
                }`}</p>
              </div>
              <div className={styles.smallArticlesContainer}>
                <div className={styles.smallArticle}>
                  <div
                    onClick={() => handleOnClick(false, 1)}
                    className={styles.smallCardImageContainer}
                    style={{
                      backgroundImage: `url(${publications?.[1]?.coverImage})`,
                    }}
                  ></div>
                  <h6
                    onClick={() => handleOnClick(false, 1)}
                    className={`${styles.mainTitle} ${styles.bold}`}
                  >
                    {publications?.[1]?.title}
                  </h6>
                  <p className={styles.secondaryArticleBody}>
                    {truncateHtmlString(publications?.[1]?.body, 220)}
                  </p>
                </div>
                <div className={styles.smallArticle}>
                  <div
                    onClick={() => handleOnClick(false, 2)}
                    className={styles.smallCardImageContainer}
                    style={{
                      backgroundImage: `url(${publications?.[2]?.coverImage})`,
                    }}
                  ></div>
                  <h6
                    onClick={() => handleOnClick(false, 2)}
                    className={`${styles.mainTitle} ${styles.bold}`}
                  >
                    {publications?.[2]?.title}
                  </h6>
                  <p className={styles.secondaryArticleBody}>
                    {truncateHtmlString(publications?.[2]?.body, 220)}
                  </p>
                </div>
              </div>
            </div>
            <div className={styles.line2}></div>
            <div className={styles.articlesContainer}>
              <div className={styles.bigArticle}>
                <div
                  onClick={() => handleOnClick(false, 2)}
                  className={styles.cardImageContainer}
                  style={{
                    backgroundImage: `url(${publications?.[3]?.coverImage})`,
                  }}
                ></div>
                <h4
                  onClick={() => handleOnClick(false, 3)}
                  className={`${styles.mainTitle} ${styles.bold}`}
                >
                  {publications?.[3]?.title}
                </h4>
                <p>{`${formatDate(publications?.[3]?.createdAt)} | ${
                  publications?.[3]?.url ? "Video" : "Article"
                }`}</p>
              </div>
              <div className={styles.smallArticlesContainer}>
                <div className={styles.smallArticle}>
                  <div
                    onClick={() => handleOnClick(false, 4)}
                    className={styles.smallCardImageContainer}
                    style={{
                      backgroundImage: `url(${publications?.[4]?.coverImage})`,
                    }}
                  ></div>
                  <h6
                    onClick={() => handleOnClick(false, 4)}
                    className={`${styles.mainTitle} ${styles.bold}`}
                  >
                    {publications?.[4]?.title}
                  </h6>
                  <p className={styles.secondaryArticleBody}>
                    {truncateHtmlString(publications?.[4]?.body, 220)}
                  </p>
                </div>
                <div className={styles.smallArticle}>
                  <div
                    onClick={() => handleOnClick(false, 5)}
                    className={styles.smallCardImageContainer}
                    style={{
                      backgroundImage: `url(${publications?.[5]?.coverImage})`,
                    }}
                  ></div>
                  <h6
                    onClick={() => handleOnClick(false, 5)}
                    className={`${styles.mainTitle} ${styles.bold}`}
                  >
                    {publications?.[5]?.title}
                  </h6>
                  <p className={styles.secondaryArticleBody}>
                    {truncateHtmlString(publications?.[5]?.body, 220)}
                  </p>
                </div>
              </div>
            </div>
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

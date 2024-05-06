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

  if (mainPublication?.coverImage)
    return (
      <div className={styles.mainContainer}>
        <div className={styles.leftContainer}>
          <div
            onClick={() =>
              router.push(
                mainPublication?.url
                  ? `/publication/video/${mainPublication?.id}`
                  : `/publication/article/${mainPublication?.id}`
              )
            }
          >
            <Image
              width={908}
              height={508}
              className={styles.mainArticleImage}
              src={mainPublication?.coverImage}
            />
            <h2 className={styles.mainTitle}>{mainPublication?.title}</h2>
            <p>
              By 360Crossmedia | Bussines / Tech |
              {mainPublication?.url ? " Video" : " Article"}
            </p>
          </div>
          <div className={styles.articlesMainContainer}>
            <div className={styles.line2}></div>
            <div className={styles.articlesContainer}>
              <div
                onClick={() =>
                  router.push(
                    publications[0]?.url
                      ? `/publication/video/${publications[0]?.id}`
                      : `/publication/article/${publications[0]?.id}`
                  )
                }
                className={styles.bigArticle}
              >
                <Image
                  width={500}
                  height={280}
                  className={styles.bigArticleImage}
                  src={publications?.[0]?.coverImage}
                />
                <h4 className={`${styles.mainTitle} ${styles.bold}`}>
                  {publications?.[0]?.title}
                </h4>
                <p>{`${formatDate(publications?.[0]?.createdAt)} | ${
                  publications?.[0]?.url ? "Video" : "Article"
                }`}</p>
              </div>
              <div className={styles.smallArticlesContainer}>
                <div
                  onClick={() =>
                    router.push(
                      publications[1]?.url
                        ? `/publication/video/${publications[1]?.id}`
                        : `/publication/article/${publications[1]?.id}`
                    )
                  }
                  className={styles.smallArticle}
                >
                  <Image
                    width={250}
                    height={167}
                    className={styles.smallArticleImage}
                    style={{ width: "100%", height: "35%" }}
                    src={publications?.[1]?.coverImage}
                  />
                  <h6 className={`${styles.mainTitle} ${styles.bold}`}>
                    {publications?.[1]?.title}
                  </h6>
                  <p className={styles.secondaryArticleBody}>
                    {truncateHtmlString(publications?.[1]?.body, 220)}
                  </p>
                </div>
                <div
                  onClick={() =>
                    router.push(
                      publications[2]?.url
                        ? `/publication/video/${publications[2]?.id}`
                        : `/publication/article/${publications[2]?.id}`
                    )
                  }
                  className={styles.smallArticle}
                >
                  <Image
                    width={250}
                    height={167}
                    className={styles.smallArticleImage}
                    style={{ width: "100%", height: "35%" }}
                    src={publications?.[2]?.coverImage}
                  />
                  <h6 className={`${styles.mainTitle} ${styles.bold}`}>
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
              <div
                onClick={() =>
                  router.push(
                    publications[3]?.url
                      ? `/publication/video/${publications[3]?.id}`
                      : `/publication/article/${publications[3]?.id}`
                  )
                }
                className={styles.bigArticle}
              >
                <Image
                  width={500}
                  height={280}
                  className={styles.bigArticleImage}
                  style={{ width: "100%", height: "60%" }}
                  src={publications?.[3]?.coverImage}
                />
                <h4 className={`${styles.mainTitle} ${styles.bold}`}>
                  {publications?.[3]?.title}
                </h4>
                <p>{`${formatDate(publications?.[3]?.createdAt)} | ${
                  publications?.[3]?.url ? "Video" : "Article"
                }`}</p>
              </div>
              <div className={styles.smallArticlesContainer}>
                <div
                  onClick={() =>
                    router.push(
                      publications[4]?.url
                        ? `/publication/video/${publications[4]?.id}`
                        : `/publication/article/${publications[4]?.id}`
                    )
                  }
                  className={styles.smallArticle}
                >
                  <Image
                    width={250}
                    height={167}
                    className={styles.smallArticleImage}
                    style={{ width: "100%", height: "35%" }}
                    src={publications?.[4]?.coverImage}
                  />
                  <h6 className={`${styles.mainTitle} ${styles.bold}`}>
                    {publications?.[4]?.title}
                  </h6>
                  <p className={styles.secondaryArticleBody}>
                    {truncateHtmlString(publications?.[4]?.body, 220)}
                  </p>
                </div>
                <div
                  onClick={() =>
                    router.push(
                      publications[5]?.url
                        ? `/publication/video/${publications[5]?.id}`
                        : `/publication/article/${publications[5]?.id}`
                    )
                  }
                  className={styles.smallArticle}
                >
                  <Image
                    width={250}
                    height={167}
                    className={styles.smallArticleImage}
                    style={{ width: "100%", height: "35%" }}
                    src={publications?.[5]?.coverImage}
                  />
                  <h6 className={`${styles.mainTitle} ${styles.bold}`}>
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

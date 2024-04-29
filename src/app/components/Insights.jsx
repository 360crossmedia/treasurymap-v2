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

const Insights = () => {
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
    dispatch(setIsLoading(false));
  };

  return (
    <div className={styles.mainContainer}>
      <div className={styles.leftContainer}>
        <Image
          width={908}
          height={508}
          className={styles.mainArticleImage}
          src={mainPublication?.coverImage}
        />
        <h2 className={styles.mainTitle}>{mainPublication?.title}</h2>
        <p>By 360Crossmedia | Bussines / Tech</p>
        <div className={styles.line2}></div>
        <div className={styles.articlesContainer}>
          <div className={styles.bigArticle}>
            <Image
              width={500}
              height={280}
              className={styles.bigArticleImage}
              src={publications?.[0]?.coverImage}
            />
            <h4 className={`${styles.mainTitle} ${styles.bold}`}>
              {publications?.[0]?.title}
            </h4>
          </div>
          <div className={styles.smallArticlesContainer}>
            <div className={styles.smallArticle}>
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
                Deeply moved by the experiences of Dr. Denis Mukwege, a globally
                recognized advocate for...
              </p>
            </div>
            <div className={styles.smallArticle}>
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
                Luxembourg Airport’s Skypark will open this year as a bold
                statement about the future of Luxembourg. The architects, Bjarke
                Ingels Group (Known as BIG) will deliver complex...
              </p>
            </div>
          </div>
        </div>
        <div className={styles.line2}></div>
        <div className={styles.articlesContainer}>
          <div className={styles.bigArticle}>
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
          </div>
          <div className={styles.smallArticlesContainer}>
            <div className={styles.smallArticle}>
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
                If there is a thankless role above all else, it is that of an
                association’s lobbyist. However, it is a vital and critical
                role, especially after a wave...
              </p>
            </div>
            <div className={styles.smallArticle}>
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
                The architect Christian de Portzamparc is passionate about the
                interpretation of his craft. Early in his career, he addressed
                the needs of urban inhabitants whose living...
              </p>
            </div>
          </div>
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

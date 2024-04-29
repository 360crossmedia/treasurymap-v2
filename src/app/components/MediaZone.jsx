"use client";
import styles from "../styles/MediaZone.module.css";
import Image from "next/image";
import ArrowRight from "../assets/arrow-right.svg";
import { useEffect, useState } from "react";
import { apiGetCompanyData } from "../service/apiGetCompanyData";
import { apiGetCountryById } from "../service/apiGetCountryById";
import { apiGetAllVideosByCompanyId } from "../service/apiGetAllVideosByCompanyId";
import { apiGetAllArticlesByCompanyId } from "../service/apiGetAllArticlesByCompanyId";
import { setIsLoading } from "../store/slices/isLoading.slice";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { haveMediaContentToShow } from "../utils";

const MediaZone = ({ companyId }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [countries, setCountries] = useState();
  const [videos, setVideos] = useState([]);
  const [articles, setArticles] = useState([]);
  const [seeMoreActive, setSeeMoreActive] = useState(false);

  const getCompanyData = async () => {
    dispatch(setIsLoading(true));
    const companyData = await apiGetCompanyData(companyId);
    const videosArray = await apiGetAllVideosByCompanyId(companyId);
    const articlesArray = await apiGetAllArticlesByCompanyId(companyId);
    const companyOffices = [];

    for (let i = 0; i < companyData?.companyOffices.length; i++) {
      const countries = await apiGetCountryById(companyData?.companyOffices[i]);
      companyOffices.push(countries);
    }

    setVideos(videosArray);
    setCountries(companyOffices);
    setArticles(articlesArray);
    dispatch(setIsLoading(false));
  };

  useEffect(() => {
    getCompanyData();
  }, []);

  return (
    <div className={styles.mainContainer}>
      <div className={styles.countriesContainer}>
        <div>
          <p className={styles.boldP}>Active In</p>
        </div>
        <div className={styles.blueCardsContainer}>
          {seeMoreActive &&
            countries?.map((country, index) => (
              <div key={index} className={styles.blueCard}>
                <p className={styles.blueCardP}>{country?.name}</p>
              </div>
            ))}
          {!seeMoreActive &&
            countries?.slice(0, 4).map((country, index) => (
              <div key={index} className={styles.blueCard}>
                <p className={styles.blueCardP}>{country?.name}</p>
              </div>
            ))}
        </div>
        {countries?.length > 4 && (
          <p
            onClick={() => setSeeMoreActive(!seeMoreActive)}
            className={styles.seeMoreBlueCards}
          >
            {!seeMoreActive ? "See more" : "See less"}
          </p>
        )}
      </div>
      {!haveMediaContentToShow(videos, articles) && (
        <h2 className={styles.title}>No media content uploaded yet.</h2>
      )}
      {videos?.map((video, index) => (
        <div key={index}>
          <div
            onClick={() => router.push(`/publication/video/${video?.id}`)}
            className={styles.articleContainer}
          >
            <img
              src={video.coverImage}
              alt=""
              className={styles.articleCoverImage}
            />
            <p className={styles.articleTitle}>
              {video?.title}
              <br />
              <a className={styles.articleA}>
                Read More
                <Image src={ArrowRight} alt="" />
              </a>
            </p>
          </div>
          <div className={styles.line}></div>
        </div>
      ))}
      {articles?.map(
        (article, index) =>
          article.live && (
            <div key={index}>
              <div
                onClick={() =>
                  router.push(`/publication/article/${article?.id}`)
                }
                className={styles.articleContainer}
              >
                <img
                  src={article.coverImage}
                  alt=""
                  className={styles.articleCoverImage}
                />
                <p className={styles.articleTitle}>
                  {article?.title}
                  <br />
                  <a className={styles.articleA}>
                    Read More
                    <Image src={ArrowRight} alt="" />
                  </a>
                </p>
              </div>
              <div className={styles.line}></div>
            </div>
          )
      )}
    </div>
  );
};

export default MediaZone;

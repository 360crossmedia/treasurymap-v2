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

const MediaZone = ({ companyId }) => {
  const dispatch = useDispatch();
  const [countries, setCountries] = useState();
  const [videos, setVideos] = useState();
  const [articles, setArticles] = useState();
  const [articleSelected, setArticleSelected] = useState(false);
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

  useEffect(() => console.log(articleSelected), [articleSelected]);

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
      {!articleSelected &&
        videos?.map((video, index) => (
          <div key={index} className={styles.videoContainer}>
            <div>
              <p className={styles.title}>{video?.title}</p>
              <iframe
                className={styles.video}
                src={video?.url}
                title={video?.title}
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowfullscreen
              ></iframe>
            </div>
            <div className={styles.line}></div>
          </div>
        ))}
      {!articleSelected &&
        articles?.map((article, index) => (
          <div key={index}>
            <div className={styles.articleContainer}>
              <p className={styles.articleTitle}>{article?.title}</p>
              <p className={styles.articleDescription}>
                {article?.body.length > 200
                  ? `${article?.body.slice(0, 200)}...`
                  : article?.body}
              </p>
              <a
                className={styles.articleA}
                onClick={() => setArticleSelected(index + 1)}
              >
                Read More
                <Image src={ArrowRight} alt="" />
              </a>
            </div>
            <div className={styles.line}></div>
          </div>
        ))}
      {articleSelected && (
        <div className={styles.articleContainer}>
          <p className={styles.articleTitle}>
            {articles[articleSelected - 1]?.title}
          </p>
          <p className={styles.articleDescription}>
            {articles[articleSelected - 1]?.body}
          </p>
          <a
            className={styles.articleA}
            onClick={() => setArticleSelected(false)}
          >
            <Image className={styles.leftArrow} src={ArrowRight} alt="" />
            Go back
          </a>
        </div>
      )}
    </div>
  );
};

export default MediaZone;

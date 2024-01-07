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

const MediaZone = () => {
  const dispatch = useDispatch();
  const [countries, setCountries] = useState();
  const [videos, setVideos] = useState();
  const [articles, setArticles] = useState();

  const getCompanyData = async () => {
    dispatch(setIsLoading(true));
    const companyData = await apiGetCompanyData(1);
    const videosArray = await apiGetAllVideosByCompanyId(1);
    const articlesArray = await apiGetAllArticlesByCompanyId(1);
    const companyOffices = [];

    for (let i = 0; i < companyData?.companyOffices.length; i++) {
      const countries = await apiGetCountryById(companyData?.companyOffices[i]);
      companyOffices.push(countries);
      console.log(countries);
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
          {countries?.map((country) => (
            <div className={styles.blueCard}>
              <p className={styles.blueCardP}>{country?.name}</p>
            </div>
          ))}
        </div>
      </div>
      {videos?.map((video, index) => (
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
      {articles?.map((article, index) => (
        <div key={index}>
          <div className={styles.articleContainer}>
            <p className={styles.articleTitle}>{article?.title}</p>
            <p className={styles.articleDescription}>{article?.body}</p>
            <a className={styles.articleA} href="#">
              Read More
              <Image src={ArrowRight} alt="" />
            </a>
          </div>
          <div className={styles.line}></div>
        </div>
      ))}
    </div>
  );
};

export default MediaZone;

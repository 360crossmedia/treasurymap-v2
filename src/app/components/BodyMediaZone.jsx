"use client";
import { useEffect, useState } from "react";
import styles from "../styles/BodyDashboard.module.css";
import styles2 from "../styles/BodyMediaZone.module.css";
import { apiGetAllArticlesByCompanyId } from "../service/apiGetAllArticlesByCompanyId";
import { useSelector } from "react-redux";
import { apiGetAllVideosByCompanyId } from "../service/apiGetAllVideosByCompanyId";

const BodyMediaZone = () => {
  const companyId = useSelector((state) => state.companyId);
  const show = useSelector((state) => state.show);
  const [articles, setArticles] = useState();
  const [videos, setVideos] = useState();

  const getCompanyMediaData = async () => {
    const result = await apiGetAllArticlesByCompanyId(companyId);
    const res = await apiGetAllVideosByCompanyId(companyId);
    setArticles(result);
    setVideos(res);
  };

  useEffect(() => {
    getCompanyMediaData();
  }, []);

  return (
    <div className={`${styles.mainContainer} ${styles2.mainContainer}`}>
      <div className={styles2.buttonsContainer}>
        <button className={`${styles.mediaZoneButton} ${styles2.updateButton}`}>
          Update
        </button>
        <button className={styles2.deleteButton}>Delete</button>
      </div>
      <div className={styles.linesContainer}>
        <div className={styles.line}></div>
        <p className={styles.or}>Or</p>
        <div className={styles.line}></div>
      </div>
      <div>
        <div className={`${styles2.videosList} ${styles2.headerList}`}>
          <p className={styles2.headerP}>Title</p>
          <p className={styles2.headerP}>Creation Date</p>
        </div>
        {show == "videos" &&
          videos?.map((video, index) => (
            <div key={index} className={styles2.videosList}>
              <p className={styles2.videoP}>{video.title}</p>
              <p className={styles2.videoP}>{video.createdAt.slice(0, 10)}</p>
            </div>
          ))}
        {show == "articles" &&
          articles?.map((article, index) => (
            <div key={index} className={styles2.videosList}>
              <p className={styles2.videoP}>{article.title}</p>
              <p className={styles2.videoP}>{article.createdAt.slice(0, 10)}</p>
            </div>
          ))}
      </div>
    </div>
  );
};

export default BodyMediaZone;

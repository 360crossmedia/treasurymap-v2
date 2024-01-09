"use client";
import { useEffect, useState } from "react";
import styles from "../styles/BodyDashboard.module.css";
import styles2 from "../styles/BodyMediaZone.module.css";
import { apiGetAllArticlesByCompanyId } from "../service/apiGetAllArticlesByCompanyId";
import { useDispatch, useSelector } from "react-redux";
import { apiGetAllVideosByCompanyId } from "../service/apiGetAllVideosByCompanyId";
import { RadioButton } from "primereact/radiobutton";
import { apiDeleteArticleById } from "../service/apiDeleteArticleById";
import { apiDeleteVideoById } from "../service/apiDeleteVideoById";
import { setIsLoading } from "../store/slices/isLoading.slice";

const BodyMediaZone = () => {
  const dispatch = useDispatch();
  const companyId = useSelector((state) => state.companyId);
  const show = useSelector((state) => state.show);
  const [articleSelected, setArticleSelected] = useState(null);
  const [videoSelected, setVideoSelected] = useState(null);
  const [articles, setArticles] = useState();
  const [videos, setVideos] = useState();

  const getCompanyMediaData = async () => {
    dispatch(setIsLoading(true));
    const result = await apiGetAllArticlesByCompanyId(companyId);
    const res = await apiGetAllVideosByCompanyId(companyId);
    setArticles(result);
    setVideos(res);
    dispatch(setIsLoading(false));
  };

  const deleteItem = async () => {
    dispatch(setIsLoading(true));
    if (show == "articles") {
      const result = await apiDeleteArticleById(articleSelected);
      if (result?.status == 200) {
        alert("Article deleted successfully");
        getCompanyMediaData();
        dispatch(setIsLoading(false));
      } else {
        console.log(result);
        dispatch(setIsLoading(false));
      }
    } else if (show == "videos") {
      const result = await apiDeleteVideoById(videoSelected);
      if (result?.status == 200) {
        alert("Video deleted successfully");
        getCompanyMediaData();
        dispatch(setIsLoading(false));
      } else {
        console.log(result);
        dispatch(setIsLoading(false));
      }
    } else {
      dispatch(setIsLoading(false));
      alert("Select any type of media");
    }
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
        <button onClick={deleteItem} className={styles2.deleteButton}>
          Delete
        </button>
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
              <div className={styles2.checkboxContainer}>
                <RadioButton
                  value={video.id}
                  onChange={(e) => setVideoSelected(e.value)}
                  checked={videoSelected == video.id ? true : false}
                />
                <p className={styles2.videoP}>{video.title}</p>
              </div>
              <p className={styles2.videoP}>{video.createdAt.slice(0, 10)}</p>
            </div>
          ))}
        {show === "articles" &&
          articles?.map((article) => (
            <div key={article.id} className={styles2.videosList}>
              <div className={styles2.checkboxContainer}>
                <RadioButton
                  value={article.id}
                  onChange={(e) => setArticleSelected(e.value)}
                  checked={articleSelected == article.id ? true : false}
                />
                <label htmlFor={`article-${article.id}`} className="ml-2">
                  {article.title}
                </label>
              </div>
              <p className={styles2.videoP}>{article.createdAt.slice(0, 10)}</p>
            </div>
          ))}
      </div>
    </div>
  );
};

export default BodyMediaZone;

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
import { useRouter } from "next/navigation";
import { setArticleId } from "../store/slices/articleId.slice";
import { setVideoId } from "../store/slices/videoId.slice";

const BodyMediaZone = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const companyId = useSelector((state) => state.companyId);
  const show = useSelector((state) => state.show);
  const [articleSelected, setArticleSelected] = useState(null);
  const [videoSelected, setVideoSelected] = useState(null);
  const [articles, setArticles] = useState();
  const [videos, setVideos] = useState();
  let backUpCompanyId;
  if (typeof window !== "undefined") {
    backUpCompanyId = localStorage.getItem("companyId");
  }

  const getCompanyMediaData = async () => {
    dispatch(setIsLoading(true));
    const result = await apiGetAllArticlesByCompanyId(
      companyId ? companyId : backUpCompanyId
    );
    const res = await apiGetAllVideosByCompanyId(
      companyId ? companyId : backUpCompanyId
    );
    setArticles(result);
    setVideos(res);
    dispatch(setIsLoading(false));
  };

  const deleteItem = async () => {
    dispatch(setIsLoading(true));
    if (show == "articles") {
      if (articleSelected) {
        const result = await apiDeleteArticleById(articleSelected);
        if (result?.status == 200) {
          alert("Article deleted successfully");
          getCompanyMediaData();
          dispatch(setIsLoading(false));
        } else {
          console.log(result);
          dispatch(setIsLoading(false));
        }
      } else {
        alert("Select an article to delete");
        dispatch(setIsLoading(false));
      }
    } else if (show == "videos") {
      if (videoSelected) {
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
        alert("Select a video to delete");
        dispatch(setIsLoading(false));
      }
    } else {
      dispatch(setIsLoading(false));
      alert("Select any type of media");
    }
  };

  const updateItem = async () => {
    dispatch(setIsLoading(true));
    if (show == "articles") {
      if (articleSelected) {
        dispatch(setArticleId(articleSelected));
        router.push("/mediaZone/article");
        dispatch(setIsLoading(false));
      } else {
        alert("Select an article to update");
        dispatch(setIsLoading(false));
      }
    } else if (show == "videos") {
      if (videoSelected) {
        dispatch(setVideoId(videoSelected));
        router.push("/mediaZone/video");
        dispatch(setIsLoading(false));
      } else {
        alert("Select a video to update");
        dispatch(setIsLoading(false));
      }
    } else {
      alert("Select any type of media");
    }
  };

  useEffect(() => {
    getCompanyMediaData();
  }, []);

  return (
    <div className={`${styles.mainContainer} ${styles2.mainContainer}`}>
      <div className={styles2.buttonsContainer}>
        <button
          onClick={() => router.push("/dashboard")}
          className={styles2.deleteButton}
        >
          Go back
        </button>
        <button
          onClick={updateItem}
          className={`${styles.mediaZoneButton} ${styles2.updateButton}`}
        >
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
                <label
                  onClick={() =>
                    window.open(`/publication/video/${video?.id}`, "_blank")
                  }
                  className={`ml-2 ${styles2.videoP}`}
                >
                  {video.title}
                </label>
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
                <label
                  onClick={() =>
                    window.open(`/publication/article/${article?.id}`, "_blank")
                  }
                  htmlFor={`article-${article.id}`}
                  className={`ml-2 ${styles2.videoP}`}
                >
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

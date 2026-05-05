"use client";
import styles from "../styles/Article.module.css";
import { useEffect, useState } from "react";
import { providerHref } from "../utils/slugify";
import { apiGetCategoryById } from "../service/apiGetCategoryById";
import { apiGetCompanyData } from "../service/apiGetCompanyData";
import { setIsLoading } from "../store/slices/isLoading.slice";
import { useDispatch } from "react-redux";
import { formatDate } from "../utils";
import { apiGetVideoById } from "../service/apiGetVideoById";

const Video = ({ videoId }) => {
  const dispatch = useDispatch();
  const [video, setVideo] = useState();
  const [company, setCompany] = useState();
  const [category, setCategory] = useState();

  useEffect(() => {
    getVideoData();
  }, []);

  const getVideoData = async () => {
    dispatch(setIsLoading(true));
    const videoData = await apiGetVideoById(videoId);
    setVideo(videoData);
    getCompanyData(videoData?.companyId);
    dispatch(setIsLoading(false));
  };

  const getCompanyData = async (id) => {
    const companyData = await apiGetCompanyData(id);
    setCompany(companyData);
    const categoryData = companyData
      ? await apiGetCategoryById(...companyData?.maincategory)
      : "";
    setCategory(categoryData);
  };

  return (
    <div className={styles.mainContainer}>
      <div className={styles.articleContainer}>
        <div className={styles.headerArticleContainer}>
          <div className={styles.headerArticle}>
            <em className={styles.articleCategory}>{category?.name}</em>
            <h1 className={styles.articleTitle}>{video?.title}</h1>
            <p className={styles.articleIntroduction}>{video?.introduction}</p>
            <div className={styles.line}></div>
          </div>
        </div>
        <iframe
          width="740"
          height="416"
          src={video?.url}
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        ></iframe>
        <div>
          <div className={styles.bodyArticle}>
            <div className={styles.authorContainer}>
              <p className={styles.author}>
                {company ? "by " : ""}
                <a
                  href={providerHref(company)}
                  className={styles.authorLink}
                >
                  {company?.name}
                </a>
              </p>
              <p className={styles.articleDate}>
                {video ? formatDate(video?.updatedAt) : ""}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Video;

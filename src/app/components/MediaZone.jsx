"use client";
import styles from "../styles/MediaZone.module.css";
import { useEffect, useState } from "react";
import { apiGetCompanyData } from "../service/apiGetCompanyData";
import { apiGetCountryById } from "../service/apiGetCountryById";
import { apiGetAllVideosByCompanyId } from "../service/apiGetAllVideosByCompanyId";
import { apiGetAllArticlesByCompanyId } from "../service/apiGetAllArticlesByCompanyId";
import { setIsLoading } from "../store/slices/isLoading.slice";
import { useDispatch } from "react-redux";
import InsightsCard from "./InsightsCard";

const MediaZone = ({ companyId }) => {
  const dispatch = useDispatch();
  const [countries,     setCountries]     = useState();
  const [videos,        setVideos]        = useState([]);
  const [articles,      setArticles]      = useState([]);
  const [seeMoreActive, setSeeMoreActive] = useState(false);

  const getCompanyData = async () => {
    dispatch(setIsLoading(true));
    try {
      // Parallel fetch — company data, videos, articles all at once
      const [companyData, videosArray, articlesArray] = await Promise.all([
        apiGetCompanyData(companyId),
        apiGetAllVideosByCompanyId(companyId),
        apiGetAllArticlesByCompanyId(companyId),
      ]);

      setVideos(videosArray ?? []);
      setArticles(articlesArray ?? []);

      // Parallel fetch for office countries (was sequential — now fixed)
      const officeCountries = await Promise.all(
        (companyData?.companyOffices ?? []).map((id) => apiGetCountryById(id))
      );
      setCountries(officeCountries);
    } catch (err) {
      console.error("MediaZone: failed to load company data", err);
    } finally {
      dispatch(setIsLoading(false));
    }
  };

  useEffect(() => {
    getCompanyData();
  }, [companyId]); // re-run if companyId changes

  const hasMedia = articles?.length > 0 || videos?.length > 0;

  return (
    <section className={styles.mainContainer} aria-label="Media Zone">

      {/* Active In */}
      {countries?.length > 0 && (
        <div className={styles.countriesContainer}>
          <p className={styles.boldP}>Active In</p>
          <div className={styles.blueCardsContainer}>
            {(seeMoreActive ? countries : countries.slice(0, 4)).map((country, index) => (
              <div key={index} className={styles.blueCard}>
                <p className={styles.blueCardP}>{country?.name}</p>
              </div>
            ))}
          </div>
          {countries.length > 4 && (
            <button
              onClick={() => setSeeMoreActive(!seeMoreActive)}
              className={styles.seeMoreBlueCards}
              style={{ background: "none", border: "none", cursor: "pointer" }}
            >
              {seeMoreActive ? "See less" : "See more"}
            </button>
          )}
        </div>
      )}

      {/* Media content */}
      {hasMedia ? (
        <>
          {articles.map((article, index) => (
            <InsightsCard key={`article-${index}`} publication={article} />
          ))}
          {videos.map((video, index) => (
            <InsightsCard key={`video-${index}`} publication={video} />
          ))}
        </>
      ) : (
        <p className={styles.title} style={{ color: "#9aa3b5", padding: "32px 0", textAlign: "center" }}>
          No media content available for this vendor yet.
        </p>
      )}

    </section>
  );
};

export default MediaZone;

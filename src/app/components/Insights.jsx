"use client";
import styles from "../styles/Insights.module.css";
import Cards from "./Cards";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setIsLoading } from "../store/slices/isLoading.slice";
import InsightsArticlesMobile from "./InsightsArticlesMobile";
import InsightsRowOfArticles from "./InsightsRowOfArticles";
import { apiGetCompanyData } from "../service/apiGetCompanyData";
import { apiGetCategoryById } from "../service/apiGetCategoryById";
import { returnOnlyCategoryName } from "../utils";
import { apiGetFullMainPublications } from "../service/apiGetFullMainPublications";

const Insights = () => {
  const dispatch = useDispatch();
  const [mainPublication, setMainPublication] = useState();
  const [company, setCompany] = useState();
  const [mainCategory, setMainCategory] = useState();
  const [mainPublications, setMainPublications] = useState([]);

  useEffect(() => {
    dispatch(setIsLoading(true));
    getAllPublications();
  }, []);

  useEffect(() => {
    if (mainPublication?.coverImage) dispatch(setIsLoading(false));
  }, [mainPublication]);

  const getAllPublications = async () => {
    const mainPublication = await apiGetFullMainPublications();
    setMainPublications(mainPublication);
    if (!mainPublication?.[0]?.url) {
      const company = await apiGetCompanyData(mainPublication?.[0]?.companyId);
      const mainCategory = await apiGetCategoryById(...company?.maincategory);
      setMainPublication(mainPublication?.[0]);
      setCompany(company);
      setMainCategory(mainCategory);
    } else {
      const company = await apiGetCompanyData(mainPublication?.[0]?.companyId);
      const mainCategory = await apiGetCategoryById(...company?.maincategory);
      setMainPublication(mainPublication?.[0]);
      setCompany(company);
      setMainCategory(mainCategory);
    }
  };

  if (mainPublication?.coverImage)
    return (
      <div className={styles.mainContainer}>
        <div className={styles.leftContainer}>
          <div>
            <a
              href={
                mainPublication?.url
                  ? `/publication/video/${mainPublication?.id}`
                  : `/publication/article/${mainPublication?.id}`
              }
            >
              <div
                className={styles.mainPublicationImageContainer}
                style={{
                  backgroundImage: `url(${mainPublication?.coverImage})`,
                }}
              ></div>
            </a>
            <a
              className={styles.link}
              href={
                mainPublication?.url
                  ? `/publication/video/${mainPublication?.id}`
                  : `/publication/article/${mainPublication?.id}`
              }
            >
              <h2 className={styles.mainTitle}>{mainPublication?.title}</h2>
            </a>
            <p>
              {company?.name ? `By ${company?.name} | ` : ``}
              <a className={styles.link} href={`/insights/${mainCategory?.id}`}>
                {returnOnlyCategoryName(mainCategory?.name)}
              </a>
              {mainPublication?.url ? " | Video" : " | Article"}
            </p>
          </div>
          <div className={styles.articlesMainContainer}>
            <div className={styles.line2}></div>
            {mainPublications.length > 1 && (
              <InsightsRowOfArticles
                publications={[
                  mainPublications?.[1],
                  mainPublications?.[2],
                  mainPublications?.[3],
                ]}
              />
            )}
            {mainPublications.length > 4 && (
              <>
                <div className={styles.line2}></div>
                <InsightsRowOfArticles
                  publications={[
                    mainPublications?.[4],
                    mainPublications?.[5],
                    mainPublications?.[6],
                  ]}
                />
              </>
            )}
            {mainPublications.length > 7 && (
              <>
                <div className={styles.line2}></div>
                <InsightsRowOfArticles
                  publications={[
                    mainPublications?.[7],
                    mainPublications?.[8],
                    mainPublications?.[9],
                  ]}
                />
              </>
            )}
            {mainPublications.length > 10 && (
              <>
                <div className={styles.line2}></div>
                <InsightsRowOfArticles
                  publications={[
                    mainPublications?.[10],
                    mainPublications?.[11],
                    mainPublications?.[12],
                  ]}
                />
              </>
            )}
            {mainPublications.length > 13 && (
              <>
                <div className={styles.line2}></div>
                <InsightsRowOfArticles
                  publications={[
                    mainPublications?.[13],
                    mainPublications?.[14],
                    mainPublications?.[15],
                  ]}
                />
              </>
            )}
          </div>
          <div className={styles.articlesMainContainerMobile}>
            <InsightsArticlesMobile publications={mainPublications} />
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

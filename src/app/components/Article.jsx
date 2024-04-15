"use client";
import styles from "../styles/Article.module.css";
import { useEffect, useState } from "react";
import { apiGetArticleById } from "../service/apiGetArticleById";
import { apiGetCategoryById } from "../service/apiGetCategoryById";
import { apiGetCompanyData } from "../service/apiGetCompanyData";
import { setIsLoading } from "../store/slices/isLoading.slice";
import { useDispatch } from "react-redux";
import { formatDate } from "../utils";

const Article = ({ articleId }) => {
  const dispatch = useDispatch();
  const [article, setArticle] = useState();
  const [company, setCompany] = useState();
  const [category, setCategory] = useState();

  useEffect(() => {
    getArticleData();
  }, []);

  const getArticleData = async () => {
    dispatch(setIsLoading(true));
    const articleData = await apiGetArticleById(articleId);
    setArticle(articleData);
    getCompanyData(articleData?.companyId);
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
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          maxWidth: "920px",
        }}
      >
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div
            style={{
              maxWidth: "700px",
            }}
          >
            <em style={{ textAlign: "start" }}>{category?.name}</em>
            <h1
              style={{
                marginTop: "20px",
                fontFamily: "lora",
                fontSize: "50px",
              }}
            >
              {article?.title}
            </h1>
            <div
              style={{
                height: "1px",
                background: "#c1c1c1",
                width: "100%",
                margin: "30px 0",
              }}
            ></div>
          </div>
        </div>
        <img
          src={article?.coverImage}
          alt=""
          style={{
            maxWidth: "920px",
          }}
        />
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div style={{ maxWidth: "700px" }}>
            <div className={styles.authorContainer}>
              <p className={styles.author}>
                {company ? "by " : ""}
                <a href="" className={styles.authorLink}>
                  {company?.name}
                </a>
              </p>
              <p className={styles.articleDate}>
                {article ? formatDate(article?.updatedAt) : ""}
              </p>
            </div>
            <div
              className={styles.htmlContainer}
              dangerouslySetInnerHTML={{ __html: article?.body }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Article;

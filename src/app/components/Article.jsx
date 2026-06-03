"use client";
import styles from "../styles/Article.module.css";
import { useEffect, useState } from "react";
import { providerHref } from "../utils/slugify";
import { apiGetArticleById } from "../service/apiGetArticleById";
import { apiGetCategoryById } from "../service/apiGetCategoryById";
import { apiGetCompanyData } from "../service/apiGetCompanyData";
import { setIsLoading } from "../store/slices/isLoading.slice";
import { useDispatch } from "react-redux";
import { formatDate } from "../utils";
import { sanitizeRich } from "../utils/sanitize";

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
    <div className={styles.mainContainer}>
      <div className={styles.articleContainer}>
        <div className={styles.headerArticleContainer}>
          <div className={styles.headerArticle}>
            <em className={styles.articleCategory}>{category?.name}</em>
            <h1 className={styles.articleTitle}>{article?.title}</h1>
            <p className={styles.articleIntroduction}>
              {article?.introduction}
            </p>
            <div className={styles.line}></div>
          </div>
        </div>
        <img
          src={article?.coverImage}
          className={styles.coverImage}
          alt={article?.title || "Article cover"}
          style={{ objectFit: "cover", objectPosition: "center 22%" }}
        />
        <div className={styles.bodyArticleContainer}>
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
                {article ? formatDate(article?.updatedAt) : ""}
              </p>
            </div>
            <div
              className={styles.htmlContainer}
              dangerouslySetInnerHTML={{ __html: sanitizeRich(article?.body) }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Article;

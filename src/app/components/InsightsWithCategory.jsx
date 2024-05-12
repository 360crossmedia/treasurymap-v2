"use client";
import { useEffect, useState } from "react";
import styles from "../styles/InsightsWithCategory.module.css";
import { apiGetCategoryById } from "../service/apiGetCategoryById";
import InsightsCard from "./InsightsCard";
import { apiGetPublicationsByCategoryId } from "../service/apiGetPublicationsByCategoryId";

const InsightsWithCategory = ({ categoryId }) => {
  const [category, setCategory] = useState();
  const [publications, setPublications] = useState();

  useEffect(() => {
    getAllInfo();
  }, []);

  const getAllInfo = async () => {
    const category = await apiGetCategoryById(categoryId);
    const publications = await apiGetPublicationsByCategoryId(categoryId);
    setCategory(category);
    setPublications(publications);
  };

  if (category)
    return (
      <div className={styles.mainContainer}>
        <h4 className={styles.categoryName}>{category?.name}</h4>
        {publications?.map(
          (publication) =>
            publication.live && (
              <InsightsCard key={publication.id} publication={publication} />
            )
        )}
      </div>
    );
};

export default InsightsWithCategory;

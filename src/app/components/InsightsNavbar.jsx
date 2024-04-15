"use client";
import { useEffect, useState } from "react";
import styles from "../styles/InsightsNavbar.module.css";
import { setIsLoading } from "../store/slices/isLoading.slice";
import { useDispatch } from "react-redux";
import { apiGetCategories } from "../service/apiGetCategories";
import { formatCategoryName } from "../utils";

const InsightsNavbar = () => {
  const dispatch = useDispatch();
  const [categories, setCategories] = useState();

  useEffect(() => {
    getCategories();
  }, []);

  const getCategories = async () => {
    dispatch(setIsLoading(true));
    const categories = await apiGetCategories();
    setCategories(categories?.data);
    dispatch(setIsLoading(false));
  };

  if (categories) {
    return (
      <div className={styles.mainContainer}>
        <nav className={styles.nav}>
          {categories &&
            categories.map((category, index) => (
              <a
                key={index}
                className={styles.link}
                href={`/insights/${category.id}`}
              >
                {formatCategoryName(category?.name)}
              </a>
            ))}
        </nav>
      </div>
    );
  }
};

export default InsightsNavbar;

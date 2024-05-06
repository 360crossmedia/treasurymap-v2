"use client";
import { useEffect, useState } from "react";
import styles from "../styles/InsightsNavbar.module.css";
import { setIsLoading } from "../store/slices/isLoading.slice";
import { useDispatch } from "react-redux";
import { apiGetCategories } from "../service/apiGetCategories";
import { formatCategoryName } from "../utils";
import { usePathname, useRouter } from "next/navigation";
import Form from "react-bootstrap/Form";

const InsightsNavbar = ({ categoryId }) => {
  const router = useRouter();
  const pathname = usePathname();
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
          <a
            href="/insights"
            className={`${styles.link} ${
              pathname == "/insights" ? styles.active : ""
            }`}
          >
            All
          </a>
          {categories &&
            categories.map((category, index) => (
              <a
                key={index}
                className={`${styles.link} ${
                  pathname == `/insights/${index + 1}` ? styles.active : ""
                }`}
                href={`/insights/${category.id}`}
              >
                {formatCategoryName(category?.name)}
              </a>
            ))}
        </nav>
        <nav className={styles.navMobile}>
          <Form.Select
            onChange={(e) => router.push(`/insights/${e.target.value}`)}
            bsPrefix={`form-select ${styles.select}`}
          >
            {pathname == "/insights" && <option value="all">All</option>}
            {pathname != "/insights" && (
              <>
                <option value={categories?.[categoryId - 1]?.id}>
                  {categories?.[categoryId - 1]?.name}
                </option>
                <option value="">All</option>
              </>
            )}
            {categories?.map(
              (category, index) =>
                category.id != categoryId && (
                  <option key={index} value={category.id}>
                    {category.name}
                  </option>
                )
            )}
          </Form.Select>
        </nav>
      </div>
    );
  }
};

export default InsightsNavbar;

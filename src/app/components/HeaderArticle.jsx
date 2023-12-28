"use client";
import styles from "../styles/HeaderDashboard.module.css";

const HeaderArticle = ({ title }) => {
  return (
    <div className={styles.mainContainer}>
      <p className={styles.title}>Media Zone ({title})</p>
    </div>
  );
};

export default HeaderArticle;

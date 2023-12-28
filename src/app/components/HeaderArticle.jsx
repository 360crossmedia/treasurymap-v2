"use client";
import styles from "../styles/HeaderDashboard.module.css";

const HeaderArticle = ({ title }) => {
  return (
    <div className={styles.mainContainer}>
      {title && <p className={styles.title}>Media Zone ({title})</p>}
      {!title && (
        <p className={styles.title}>Complete the company's information</p>
      )}
    </div>
  );
};

export default HeaderArticle;

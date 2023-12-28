"use client";
import styles from "../styles/BodyDashboard.module.css";

const BodyDashboard = () => {
  return (
    <div className={styles.mainContainer}>
      <div>
        <button className={styles.mediaZoneButton}>Media Zone</button>
      </div>
      <div className={styles.linesContainer}>
        <div className={styles.line}></div>
        <p className={styles.or}>Or</p>
        <div className={styles.line}></div>
      </div>
      <div>
        <button className={styles.createCompanyButton}>
          Create a new company
        </button>
      </div>
    </div>
  );
};

export default BodyDashboard;

import React from "react";
import styles from "../styles/Loader.module.css";

const LoadingScreen = () => {
  return (
    <div className={styles.backgroundSpinner}>
      <div className={styles.ldsSpinner}>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
};

export default LoadingScreen;

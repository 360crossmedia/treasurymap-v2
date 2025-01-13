"use client";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import styles from "./styles/layout.module.css";
import NewTreasuryMap from "./components/newmap3/NewTreasuryMap3";
import MultiplayerMap from "./components/multiplayerMap/MultiplayerMap";
import "./components/newmap3/NewTreasuryMap3.css";
import { useState, useEffect } from "react";

const Layout = () => {
  const [isMultiplayerMap, setIsMultiplayerMap] = useState(true);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    if (animating) {
      const timer = setTimeout(() => {
        setAnimating(false);
      }, 600); // Duración de la animación
      return () => clearTimeout(timer);
    }
  }, [animating]);

  const handleToggleMap = () => {
    setAnimating(true);
    setIsMultiplayerMap((prev) => !prev);
  };

  return (
    <div
      className={styles.mainContainer}
      style={{ backgroundPosition: "bottom", paddingTop: 0 }}
    >
      <div className={styles.mainContainerMap}>
        <Navbar
          buttonLabel={"Log In"}
          multiplayerMap={isMultiplayerMap}
          set={setIsMultiplayerMap}
          rotate={handleToggleMap}
        />
      </div>

      <div className={styles.mapContainer}>
        <div
          className={`${styles.mapWrapper} ${styles.treasuryMap} ${
            isMultiplayerMap
              ? animating
                ? styles.slideOutLeft
                : styles.hidden
              : animating
              ? styles.slideInLeft
              : ""
          }`}
        >
          <NewTreasuryMap />
        </div>
        <div
          className={`${styles.mapWrapper} ${styles.multiplayerMap} ${
            isMultiplayerMap
              ? animating
                ? styles.slideInRight
                : ""
              : animating
              ? styles.slideOutRight
              : styles.hidden
          }`}
        >
          <MultiplayerMap />
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Layout;

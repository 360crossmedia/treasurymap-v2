"use client";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import styles from "./styles/layout.module.css";
import NewTreasuryMap from "./components/newmap3/NewTreasuryMap3";
import MultiplayerMap from "./components/multiplayerMap/MultiplayerMap";
import "./components/multiplayerMap/MultiplayerMap.css";
import { useState } from "react";

const Layout = () => {
  const [isMultiplayerMap, setIsMultiplayerMap] = useState(false);
  const [flipping, setFlipping] = useState(false);

  const handleToggleMap = () => {
    setFlipping(true);
    setTimeout(() => {
      setIsMultiplayerMap(!isMultiplayerMap);
      setFlipping(false);
    }, 600); // Duración de la animación (coincide con el CSS)
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

      <div
        className={`${styles.flipContainer} ${flipping ? styles.flipping : ""}`}
      >
        <div className={styles.flipCard}>
          <div className={styles.front}>
            {isMultiplayerMap ? <MultiplayerMap /> : <NewTreasuryMap />}
          </div>
          <div className={styles.back}>
            {!isMultiplayerMap ? <NewTreasuryMap /> : <MultiplayerMap />}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Layout;

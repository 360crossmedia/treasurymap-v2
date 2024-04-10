"use client";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import styles from "../styles/layout.module.css";

// import TreasuryMap from "./components/map/TreasuryMap";
// import "./components/map/TreasuryMap.css";

import NewTreasuryMap from '../components/newmap/NewTreasuryMap';
import '../components/newmap/NewTreasuryMap.css'

const Layout = () => {
  return (
    <div
      className={styles.mainContainer}
      style={{ backgroundPosition: "bottom", paddingTop: 0 }}
    >
      <div className={styles.mainContainerMap}>
        <Navbar buttonLabel={"Log In"} />
      </div>
      
      {/* 
      
      VIEJO COMPONENTE , VERSION 1.0 DEL MAPA
      <TreasuryMap /> 
      
      */}
      
      <NewTreasuryMap />

      <Footer />
    </div>
  );
};

export default Layout;

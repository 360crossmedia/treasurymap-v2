"use client";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import styles from "../styles/layout.module.css";

// import TreasuryMap from "./components/map/TreasuryMap";
// import "./components/map/TreasuryMap.css";

import NewTreasuryMap3 from '../components/newmap3/NewTreasuryMap3.jsx';
import '../components/newmap3/NewTreasuryMap3.css'

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
      
      <NewTreasuryMap3 />

      <Footer />
    </div>
  );
};

export default Layout;

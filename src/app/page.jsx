"use client";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import styles from "./styles/layout.module.css";
import TreasuryMap from "./components/map/TreasuryMap";
import './components/map/TreasuryMap.css'

const Layout = () => {
  return (
    <div
      className={styles.mainContainer}
      style={{ backgroundPosition: "bottom", paddingTop: 0 }}
    >
      <div className={styles.mainContainerMap}>
        <Navbar buttonLabel={"Sign up"} />
      </div>

        <TreasuryMap/>

      <Footer />
    </div>
  );
};

export default Layout;

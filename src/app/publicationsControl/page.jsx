"use client";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import styles from "../styles/layout.module.css";
import HeaderMediaZone from "./components/HeaderMediaZone";
import BodyMediaZone from "./components/BodyMediaZone";

const Layout = () => {
  return (
    <>
      <div
        className={styles.mainContainer}
        style={{ backgroundPosition: "bottom", paddingBottom: "1.65%" }}
      >
        <Navbar buttonLabel={"Login"} />
        <HeaderMediaZone />
      </div>
      <BodyMediaZone />
      <Footer />
    </>
  );
};

export default Layout;

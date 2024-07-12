"use client";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import styles from "../styles/layout.module.css";
import HeaderPublicationsControl from "./components/HeaderPublicationsControl";
import BodyPublicationsControl from "./components/BodyPublicationsControl";

const Layout = () => {
  return (
    <>
      <div
        className={styles.mainContainer}
        style={{ backgroundPosition: "bottom", paddingBottom: "1.65%" }}
      >
        <Navbar buttonLabel={"Login"} />
        <HeaderPublicationsControl />
      </div>
      <BodyPublicationsControl />
      <Footer />
    </>
  );
};

export default Layout;

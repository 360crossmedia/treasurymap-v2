"use client";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import styles from "../styles/layout.module.css";
import Gdpr from "../components/gdpr";

const Layout = () => {
  return (
    <div className={styles.mainContainer}>
      <Navbar buttonLabel={"Login"} />
      <Gdpr />
      <Footer />
    </div>
  );
};

export default Layout;

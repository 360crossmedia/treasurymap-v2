"use client";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import styles from "../styles/layout.module.css";
import HeaderDashboard from "../components/HeaderDashboard";
import BodyDashboard from "../components/BodyDashboard";

const Layout = () => {
  return (
    <>
      <div
        className={styles.mainContainer}
        style={{ backgroundPosition: "bottom", paddingBottom: "1.65%" }}
      >
        <Navbar buttonLabel={"Login"} />
        <HeaderDashboard />
      </div>
      <BodyDashboard />
      <Footer />
    </>
  );
};

export default Layout;

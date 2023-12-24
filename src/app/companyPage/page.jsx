"use client";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import styles from "../styles/layout.module.css";
import CompanyPage from "../components/CompanyPage";

const Layout = () => {
  return (
    <>
      <div
        className={styles.mainContainer}
        style={{ backgroundPosition: "bottom" }}
      >
        <Navbar buttonLabel={"Login"} />
        <CompanyPage />
      </div>
      <Footer />
    </>
  );
};

export default Layout;

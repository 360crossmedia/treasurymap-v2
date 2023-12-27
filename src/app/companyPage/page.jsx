"use client";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import styles from "../styles/layout.module.css";
import CompanyPage from "../components/CompanyPage";
import Body from "../components/BodyCompanyPage";

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
      <Body />
      <Footer />
    </>
  );
};

export default Layout;

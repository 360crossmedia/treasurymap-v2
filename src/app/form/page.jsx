"use client";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import styles from "../styles/layout.module.css";
import HeaderArticle from "../components/HeaderArticle";
import BodyForm from "../components/BodyForm";

const Layout = () => {
  return (
    <>
      <div
        className={styles.mainContainer}
        style={{ backgroundPosition: "bottom", paddingBottom: "1.65%" }}
      >
        <Navbar buttonLabel={"Login"} />
        <HeaderArticle title={false} />
      </div>
      <BodyForm />
      <Footer />
    </>
  );
};

export default Layout;

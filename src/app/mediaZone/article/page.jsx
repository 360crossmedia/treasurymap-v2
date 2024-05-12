"use client";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import styles from "../../styles/layout.module.css";
import HeaderArticle from "../../components/HeaderArticle";
import dynamic from "next/dynamic";

const Layout = () => {
  const BodyArticle = dynamic(() => import("../../components/BodyArticle"), {
    ssr: false,
  });
  return (
    <>
      <div
        className={styles.mainContainer}
        style={{ backgroundPosition: "bottom", paddingBottom: "1.65%" }}
      >
        <Navbar buttonLabel={"Login"} />
        <HeaderArticle title={"Article"} />
      </div>
      <BodyArticle isArticle={true} />
      <Footer />
    </>
  );
};

export default Layout;

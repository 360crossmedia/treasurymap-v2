"use client";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import styles from "../../styles/layout.module.css";
import Article from "../../components/Article";
import InsightsNavbar from "@/app/components/InsightsNavbar";

const Layout = ({ params }) => {
  return (
    <>
      <div
        className={styles.mainContainer}
        style={{ backgroundPosition: "bottom", paddingBottom: "1.65%" }}
      >
        <Navbar buttonLabel={"Login"} />
        <InsightsNavbar />
        <Article articleId={params.articleId} />
      </div>
      <Footer />
    </>
  );
};

export default Layout;

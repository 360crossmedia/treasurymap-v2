"use client";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import styles from "../../styles/layout.module.css";
import InsightsNavbar from "@/app/components/InsightsNavbar";
import InsightsWithCategory from "@/app/components/InsightsWithCategory";

const Layout = ({ params }) => {
  return (
    <>
      <div
        className={styles.mainContainer}
        style={{ backgroundPosition: "bottom", paddingBottom: "1.65%" }}
      >
        <Navbar buttonLabel={"Login"} />
        <InsightsNavbar categoryId={params.categoryId} />
        <InsightsWithCategory categoryId={params.categoryId} />
      </div>
      <Footer />
    </>
  );
};

export default Layout;

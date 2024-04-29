"use client";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import styles from "../../../styles/layout.module.css";
import InsightsNavbar from "@/app/components/InsightsNavbar";
import Video from "@/app/components/Video";

const Layout = ({ params }) => {
  return (
    <>
      <div
        className={styles.mainContainer}
        style={{ backgroundPosition: "bottom", paddingBottom: "1.65%" }}
      >
        <Navbar buttonLabel={"Login"} />
        <InsightsNavbar />
        <Video videoId={params.videoId} />
      </div>
      <Footer />
    </>
  );
};

export default Layout;

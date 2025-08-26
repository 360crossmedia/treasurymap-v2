"use client";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import styles from "../../styles/layout.module.css";
import Overview from "../../components/Overview";
import HeaderCompanyPage from "../../components/HeaderCompanyPage";
import MediaZone from "../../components/MediaZone";
import { useSelector } from "react-redux";
import { use } from "react";

const Layout = ({ params }) => {
  const isOverview = useSelector((state) => state.isOverview);
  const { companyId } = use(params);
  return (
    <>
      <div
        className={styles.mainContainer}
        style={{ backgroundPosition: "bottom" }}
      >
        <Navbar buttonLabel={"Login"} />
        <HeaderCompanyPage companyId={companyId} />
      </div>
      {isOverview && <Overview companyId={companyId} />}
      {!isOverview && <MediaZone companyId={companyId} />}
      <Footer />
    </>
  );
};

export default Layout;

"use client";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import styles from "../../styles/layout.module.css";
import Overview from "../../components/Overview";
import HeaderCompanyPage from "../../components/HeaderCompanyPage";
import MediaZone from "../../components/MediaZone";
import { useSelector } from "react-redux";

const CompanyPageClient = ({ companyId, initialCompany }) => {
  const isOverview = useSelector((state) => state.isOverview);
  return (
    <>
      <div
        className={styles.mainContainer}
        style={{ backgroundPosition: "bottom" }}
      >
        <Navbar buttonLabel={"Login"} />
        <HeaderCompanyPage
          companyId={companyId}
          initialCompany={initialCompany}
        />
      </div>
      {isOverview && (
        <Overview companyId={companyId} initialCompany={initialCompany} />
      )}
      {!isOverview && <MediaZone companyId={companyId} />}
      <Footer />
    </>
  );
};

export default CompanyPageClient;

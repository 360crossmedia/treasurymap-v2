"use client";
import Image from "next/image";
import styles from "../styles/CompanyPage.module.css";
import companyImg from "../assets/companyImg.svg";

const Header = () => {
  return (
    <div className={styles.mainContainer}>
      <div>
        <Image className={styles.companyImg} alt="" src={companyImg} />
      </div>
      <div className={styles.categoryCardsContainer}>
        <p className={styles.title}>Deloitte</p>
        <div className={styles.categoryCard}>
          <p className={styles.categoryP}>
            Category:
            <span className={styles.span}>
              {" "}
              FIDP - Financial Instrument Dealing
            </span>
          </p>
        </div>
        <div className={styles.categoryCard}>
          <p className={styles.categoryP}>
            Category:{" "}
            <span className={styles.span}>
              List types of financial instruments covered: OTC and regulated
              markets
            </span>
          </p>
        </div>
        <div className={styles.cardsContainer}>
          <div className={styles.card}>
            <p className={styles.cardP}>Creation</p>
            <p className={styles.cardBigP}>2001</p>
          </div>
          <div className={styles.card}>
            <p className={styles.cardP}>Number Of employes</p>
            <p className={styles.cardBigP}>5600</p>
          </div>
          <div className={styles.card}>
            <p className={styles.cardP}>Turnover</p>
            <p className={styles.cardBigP}>5600</p>
          </div>
          <div className={styles.card}>
            <p className={styles.cardP}>Headquarters</p>
            <p className={styles.cardBigP}>Paris</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const CompanyPage = () => {
  return <Header />;
};

export default CompanyPage;

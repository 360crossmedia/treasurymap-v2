"use client";
import Image from "next/image";
import styles from "../styles/HeaderCompanyPage.module.css";
import companyImg from "../assets/companyImg.svg";
import ArrowDown from "../assets/ArrowDown.svg";
import { useDispatch } from "react-redux";
import { setIsOverview } from "../store/slices/isOverview.slice";
import { useSelector } from "react-redux";

const HeaderCompanyPage = () => {
  const isOverview = useSelector((state) => state.isOverview);
  const dispatch = useDispatch();

  return (
    <>
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
      <div className={styles.headerCardDown}>
        <div className={styles.headerLinks}>
          <p
            className={`${styles.customP} ${
              isOverview ? styles.active : styles.disabled
            }`}
            onClick={() => dispatch(setIsOverview(true))}
          >
            Overview
          </p>
          <p
            className={`${styles.customP2} ${
              isOverview ? styles.disabled : styles.active
            }`}
            onClick={() => dispatch(setIsOverview(false))}
          >
            Media Zone
          </p>
        </div>
        <div className={styles.countriesContainer}>
          <div className={styles.line}></div>
          <p className={styles.boldP}>Active In</p>
          <div className={styles.blueCard}>
            <p className={styles.blueCardP}>France</p>
          </div>
          <div className={styles.blueCard}>
            <p className={styles.blueCardP}>Belgium</p>
          </div>
          <div className={styles.blueCard}>
            <p className={styles.blueCardP}>Spain</p>
          </div>
          <div className={styles.blueCard}>
            <p className={styles.blueCardP}>Morocco</p>
          </div>
          <div className={styles.blueCard}>
            <p className={styles.blueCardP}>Germany</p>
          </div>
          <Image src={ArrowDown} alt="" />
        </div>
      </div>
    </>
  );
};

export default HeaderCompanyPage;

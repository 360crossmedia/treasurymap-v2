"use client";
import Image from "next/image";
import styles from "../styles/HeaderCompanyPage.module.css";
import ArrowDown from "../assets/ArrowDown.svg";
import companyImg from "../assets/companyImg.svg";
import { useDispatch } from "react-redux";
import { setIsOverview } from "../store/slices/isOverview.slice";
import { useSelector } from "react-redux";
import { apiGetCompanyData } from "../service/apiGetCompanyData";
import { apiGetCategoryById } from "../service/apiGetCategoryById";
import { useEffect, useState } from "react";
import { apiGetCountryById } from "../service/apiGetCountryById";
import { setIsLoading } from "../store/slices/isLoading.slice";

const HeaderCompanyPage = ({ companyId }) => {
  const isOverview = useSelector((state) => state.isOverview);
  const dispatch = useDispatch();
  const [company, setCompany] = useState();
  const [categories, setCategories] = useState();
  const [companyOffices, setCompanyOffices] = useState();

  const getCompanyData = async () => {
    dispatch(setIsLoading(true));
    const companyData = await apiGetCompanyData(companyId);
    const companyCategories = [];
    const companyOffices = [];
    for (let i = 0; i < companyData?.companyCategories.length; i++) {
      const result = await apiGetCategoryById(
        companyData?.companyCategories[i]
      );
      companyCategories.push(result);
    }
    for (let i = 0; i < companyData?.companyOffices.length; i++) {
      const result = await apiGetCountryById(companyData?.companyOffices[i]);
      companyOffices.push(result);
    }
    setCompany(companyData);
    setCategories(companyCategories);
    setCompanyOffices(companyOffices);
    dispatch(setIsLoading(false));
  };

  useEffect(() => {
    getCompanyData();
  }, []);

  return (
    <>
      <div className={styles.mainContainer}>
        <div className={styles.imgContainer}>
          <Image
            width={167}
            height={90}
            alt=""
            src={!company ? companyImg : company?.logo}
          />
        </div>
        <div className={styles.categoryCardsContainer}>
          <p className={styles.title}>{company?.name}</p>
          {categories?.map((category, index) => (
            <div key={index} className={styles.categoryCard}>
              <p className={styles.categoryP}>
                Category:
                <span className={styles.span}> {category?.name}</span>
              </p>
            </div>
          ))}
          <div className={styles.cardsContainer}>
            <div className={`${styles.card} ${styles.cardLeft}`}>
              <p className={styles.cardP}>Creation</p>
              <p className={styles.cardBigP}>{company?.creationDate}</p>
            </div>
            <div className={`${styles.card} ${styles.cardRight}`}>
              <p className={styles.cardP}>Number Of employes</p>
              <p className={styles.cardBigP}>{company?.employees}</p>
            </div>
            <div className={`${styles.card} ${styles.cardLeft}`}>
              <p className={styles.cardP}>Turnover</p>
              <p className={styles.cardBigP}>{company?.turnover}</p>
            </div>
            <div className={`${styles.card} ${styles.cardRight}`}>
              <p className={styles.cardP}>Headquarters</p>
              <p className={styles.cardBigP}>{company?.location}</p>
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
          <p className={styles.boldP}>Active In</p>
          {companyOffices?.map((office, index) => (
            <div key={index} className={styles.blueCard}>
              <p className={styles.blueCardP}>{office?.name}</p>
            </div>
          ))}
          <Image src={ArrowDown} alt="" />
        </div>
      </div>
    </>
  );
};

export default HeaderCompanyPage;

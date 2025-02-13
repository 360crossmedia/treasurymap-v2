"use client";
import Image from "next/image";
import styles from "../styles/HeaderCompanyPage.module.css";
import companyImg from "../assets/placeholderimg.jpg";
import { useDispatch } from "react-redux";
import { setIsOverview } from "../store/slices/isOverview.slice";
import { useSelector } from "react-redux";
import { apiGetCompanyData } from "../service/apiGetCompanyData";
import { apiGetCategoryById } from "../service/apiGetCategoryById";
import { useEffect, useState } from "react";
import { apiGetCountryById } from "../service/apiGetCountryById";
import { setIsLoading } from "../store/slices/isLoading.slice";
import { apiGetSubCategoryById } from "../service/apiGetSubCategoryById";
import { formatTurnover } from "../utils";
import Modal from "react-bootstrap/Modal";
import { apiGetSubOptionsByCompany } from "../service/apiGetSubOptionsByCompany";
import { apiGetAllSubOptions } from "../service/apiGetAllSubOptions";

const HeaderCompanyPage = ({ companyId }) => {
  const isOverview = useSelector((state) => state.isOverview);
  const dispatch = useDispatch();
  const [company, setCompany] = useState();
  const [categories, setCategories] = useState();
  const [subCategories, setSubCategories] = useState();
  const [companyOffices, setCompanyOffices] = useState();
  const [show, setShow] = useState(false);

  const getCompanyData = async () => {
    dispatch(setIsLoading(true));
    const companyData = await apiGetCompanyData(companyId);
    const companyCategories = [];
    const companySubCategories = [];
    const companyOffices = [];
    for (let i = 0; i < companyData?.companyCategories.length; i++) {
      const result = await apiGetCategoryById(
        companyData?.companyCategories[i]
      );
      if (result.sub_options.length > 0) {
        await thisCompanyHasSubOptions(result, companyCategories);
      } else companyCategories.push(result);
    }
    for (let i = 0; i < companyData?.companySubcategories.length; i++) {
      const result = await apiGetSubCategoryById(
        companyData?.companySubcategories[i]
      );
      companyData?.companyCategories[i];
      companySubCategories.push(result);
    }
    for (let i = 0; i < companyData?.companyOffices.length; i++) {
      const result = await apiGetCountryById(companyData?.companyOffices[i]);
      companyOffices.push(result);
    }
    setCompany(companyData);

    const stringCategories = companyCategories
      .map((item) => item.name)
      .join(", ");
    setCategories(stringCategories);

    const stringSubCat = companySubCategories
      .map((item) => item.name)
      .join(", ");
    setSubCategories(stringSubCat);

    setCompanyOffices(companyOffices);
    dispatch(setIsLoading(false));
  };

  const thisCompanyHasSubOptions = async (result2, companyCategories) => {
    const result = await apiGetSubOptionsByCompany(companyId);
    if (result.length > 0) {
      const finalResult = await apiGetAllSubOptions();
      const match = finalResult.find(
        (subOption) => subOption.id == result[0]?.subOptionId
      );
      result2.name = result2.name + ": " + match?.name;
      companyCategories.push(result2);
    }
  };

  useEffect(() => {
    getCompanyData();
  }, []);

  return (
    <>
      <div className={styles.mainContainer}>
        <div className={styles.imgContainer}>
          <Image
            alt=""
            src={!company?.logo ? companyImg : company?.logo}
            width={0}
            height={0}
            sizes="100vw"
            style={{ width: "80%", height: "auto", maxHeight: "95%" }} // optional
          />
        </div>

        <div className={styles.categoryCardsContainer}>
          <p className={styles.title}>{company?.name}</p>

          {/* {categories?.map((category, index) => (
            <div key={index} className={styles.categoryCard}>
              <p className={styles.categoryP}>
                Category:
                <span className={styles.span}> {category?.name}</span>
              </p>
            </div>
          ))} */}

          <div key={"category"} className={styles.categoryCard}>
            <p className={styles.categoryP}>
              Categories:
              <span className={styles.span}> {categories}</span>
            </p>
          </div>

          {/* {subCategories?.map((subCategory, index) => (
            <div key={index} className={styles.categoryCard}>
              <p className={styles.categoryP}>
                Sub-Category:
                <span className={styles.span}> {subCategory?.name}</span>
              </p>
            </div>
          ))} */}

          <div key={"subcategory"} className={styles.categoryCard}>
            <p className={styles.categoryP}>
              Sub-Categories:
              <span className={styles.span}> {subCategories}</span>
            </p>
          </div>

          <div className={styles.cardsContainer}>
            <div className={`${styles.card} ${styles.cardLeft}`}>
              <p className={styles.cardP}>Creation</p>
              <p className={styles.cardBigP}>{company?.creationDate}</p>
            </div>
            <div className={`${styles.card} ${styles.cardRight}`}>
              <p className={styles.cardP}>Number Of employes</p>
              <p className={styles.cardBigP}>{company?.employees}</p>
            </div>

            {!(company?.turnover == 0) && company?.showTurnover && (
              <div className={`${styles.card} ${styles.cardLeft}`}>
                <p className={styles.cardP}>Turnover</p>
                <p className={styles.cardBigP}>
                  {formatTurnover(company?.turnover)}
                </p>
              </div>
            )}

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
          {!show &&
            companyOffices?.slice(0, 3).map((office, index) => (
              <div key={index} className={styles.blueCard}>
                <p className={styles.blueCardP}>{office?.name}</p>
              </div>
            ))}
          {companyOffices?.length >= 4 && (
            <div
              onClick={() => setShow(true)}
              className={`${styles.blueCard} ${styles.color}`}
            >
              <p className={styles.blueCardP}>See more</p>
            </div>
          )}
          {show && (
            <Modal
              aria-labelledby="contained-modal-title-vcenter"
              centered
              show={show}
              onHide={() => setShow(false)}
            >
              <Modal.Header closeButton>
                <Modal.Title>Active In</Modal.Title>
              </Modal.Header>
              <Modal.Body className={styles.moreCountriesContainer}>
                {companyOffices?.map((office, index) => (
                  <div key={index} className={styles.blueCard}>
                    <p className={styles.blueCardP}>{office?.name}</p>
                  </div>
                ))}
              </Modal.Body>
            </Modal>
          )}
        </div>
      </div>
    </>
  );
};

export default HeaderCompanyPage;

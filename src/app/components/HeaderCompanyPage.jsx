"use client";
import Image from "next/image";
import styles from "../styles/HeaderCompanyPage.module.css";
import companyImg from "../assets/placeholderimg.jpg";
import { useDispatch, useSelector } from "react-redux";
import { setIsOverview } from "../store/slices/isOverview.slice";
import { apiGetCompanyData } from "../service/apiGetCompanyData";
import { apiGetCategoryById } from "../service/apiGetCategoryById";
import { useEffect, useState } from "react";
import { apiGetCountryById } from "../service/apiGetCountryById";
import { setIsLoading } from "../store/slices/isLoading.slice";
import { apiGetSubCategoryById } from "../service/apiGetSubCategoryById";
import { formatTurnover } from "../utils";
import { cld } from "../utils/cloudinary";
import Modal from "react-bootstrap/Modal";
import { apiGetSubOptionsByCompany } from "../service/apiGetSubOptionsByCompany";
import { apiGetAllSubOptions } from "../service/apiGetAllSubOptions";

const HeaderCompanyPage = ({ companyId, initialCompany }) => {
  const isOverview = useSelector((state) => state.isOverview);
  const dispatch   = useDispatch();
  const [company,        setCompany]        = useState(initialCompany ?? undefined);
  const [categories,     setCategories]     = useState();
  const [subCategories,  setSubCategories]  = useState();
  const [companyOffices, setCompanyOffices] = useState();
  const [show,           setShow]           = useState(false);

  const getCompanyData = async () => {
    dispatch(setIsLoading(true));
    const companyData = initialCompany ?? (await apiGetCompanyData(companyId));

    // Parallel fetch — categories, subcategories, offices, sub-options all at once
    const [resolvedCategories, companySubCategories, companyOfficesData, subOptionsByCompany, allSubOptions] =
      await Promise.all([
        Promise.all((companyData?.companyCategories ?? []).map((id) => apiGetCategoryById(id))),
        Promise.all((companyData?.companySubcategories ?? []).map((id) => apiGetSubCategoryById(id))),
        Promise.all((companyData?.companyOffices ?? []).map((id) => apiGetCountryById(id))),
        // Fetch sub-options once upfront instead of per-category (fixes N+1)
        apiGetSubOptionsByCompany(companyId),
        apiGetAllSubOptions(),
      ]);

    // Enrich category names with sub-option suffixes
    const companyCategories = resolvedCategories.map((cat) => {
      if (cat.sub_options?.length > 0 && subOptionsByCompany?.length > 0) {
        const match = allSubOptions.find((so) => so.id === subOptionsByCompany[0]?.subOptionId);
        if (match) return { ...cat, name: `${cat.name}: ${match.name}` };
      }
      return cat;
    });

    setCompany(companyData);
    setCategories(companyCategories.map((c) => c.name).join(", "));
    setSubCategories(companySubCategories.map((c) => c.name).join(", "));
    setCompanyOffices(companyOfficesData);
    dispatch(setIsLoading(false));
  };

  useEffect(() => {
    getCompanyData();
  }, [companyId]); // re-run if companyId changes

  return (
    <>
      <div className={styles.mainContainer}>
        {/* Company logo */}
        <div className={styles.imgContainer}>
          <Image
            alt={company?.name ? `${company.name} logo` : "Company logo"}
            src={!company?.logo ? companyImg : cld(company?.logo, { w: 600 })}
            width={0}
            height={0}
            sizes="100vw"
            priority
            style={{ width: "80%", height: "auto", maxHeight: "95%" }}
          />
        </div>

        {/* Company name + metadata */}
        <div className={styles.categoryCardsContainer}>
          {/* SEO: company name as h1 */}
          <h1 className={styles.title}>{company?.name}</h1>

          <div className={styles.categoryCard}>
            <p className={styles.categoryP}>
              Categories:
              <span className={styles.span}> {categories}</span>
            </p>
          </div>

          <div className={styles.categoryCard}>
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
              <p className={styles.cardP}>Number of employees</p>
              <p className={styles.cardBigP}>{company?.employees}</p>
            </div>
            {!(company?.turnover == 0) && company?.showTurnover && (
              <div className={`${styles.card} ${styles.cardLeft}`}>
                <p className={styles.cardP}>Turnover</p>
                <p className={styles.cardBigP}>{formatTurnover(company?.turnover)}</p>
              </div>
            )}
            <div className={`${styles.card} ${styles.cardRight}`}>
              <p className={styles.cardP}>Headquarters</p>
              <p className={styles.cardBigP}>{company?.location}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tab navigation — buttons for accessibility */}
      <nav className={styles.headerCardDown} aria-label="Company sections">
        <div className={styles.headerLinks}>
          <button
            className={`${styles.customP} ${isOverview ? styles.active : styles.disabled}`}
            onClick={() => dispatch(setIsOverview(true))}
            aria-pressed={isOverview}
          >
            Overview
          </button>
          <button
            className={`${styles.customP2} ${isOverview ? styles.disabled : styles.active}`}
            onClick={() => dispatch(setIsOverview(false))}
            aria-pressed={!isOverview}
          >
            Media Zone
          </button>
        </div>

        {/* Active In */}
        <div className={styles.countriesContainer}>
          <p className={styles.boldP}>Active In</p>
          {!show && companyOffices?.slice(0, 3).map((office, index) => (
            <div key={index} className={styles.blueCard}>
              <p className={styles.blueCardP}>{office?.name}</p>
            </div>
          ))}
          {companyOffices?.length >= 4 && (
            <button
              onClick={() => setShow(true)}
              className={`${styles.blueCard} ${styles.color}`}
              style={{ background: "none", border: "none", cursor: "pointer" }}
            >
              <p className={styles.blueCardP}>See more</p>
            </button>
          )}

          {show && (
            <Modal
              aria-labelledby="active-in-modal-title"
              centered
              show={show}
              onHide={() => setShow(false)}
            >
              <Modal.Header closeButton>
                <Modal.Title id="active-in-modal-title">Active In</Modal.Title>
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
      </nav>
    </>
  );
};

export default HeaderCompanyPage;

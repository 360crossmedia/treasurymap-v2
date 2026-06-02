"use client";
import { useEffect, useState } from "react";
import styles from "../styles/Overview.module.css";
import Image from "next/image";
import companyImg from "../assets/placeholderimg.jpg";
import { apiGetCompanyData } from "../service/apiGetCompanyData";
import { apiGetAllQuestions } from "../service/apiGetAllQuestions";
import { apiGetCompanyAnswers } from "../service/apiGetCompanyAnswers";
import { apiGetCountryById } from "../service/apiGetCountryById";
import { useDispatch } from "react-redux";
import { setIsLoading } from "../store/slices/isLoading.slice";
import { formatTurnover } from "../utils";
import { sanitizeRich } from "../utils/sanitize";
import { cld } from "../utils/cloudinary";

const Overview = ({ companyId, initialCompany }) => {
  const dispatch = useDispatch();
  const [company,        setCompany]        = useState(initialCompany ?? undefined);
  const [questions,      setQuestions]      = useState();
  const [answers,        setAnswers]        = useState();
  const [countries,      setCountries]      = useState();
  const [seeMoreActive,  setSeeMoreActive]  = useState(false);

  const getCompanyData = async () => {
    dispatch(setIsLoading(true));
    const [result, questionsRes, answersRes] = await Promise.all([
      initialCompany ? Promise.resolve(initialCompany) : apiGetCompanyData(companyId),
      apiGetAllQuestions(),
      apiGetCompanyAnswers(companyId),
    ]);

    setCompany(result);
    setQuestions(questionsRes?.data);
    setAnswers(answersRes);

    // Parallel fetch for office countries
    const officeCountries = await Promise.all(
      (result?.companyOffices ?? []).map((id) => apiGetCountryById(id))
    );
    setCountries(officeCountries);
    dispatch(setIsLoading(false));
  };

  useEffect(() => {
    getCompanyData();
  }, [companyId]); // re-run if companyId changes

  return (
    <article className={styles.mainContainer}>
      {/* Left — company details */}
      <div className={styles.left}>

        {/* About section */}
        <section aria-labelledby="about-heading">
          <h2 id="about-heading" className={styles.mainTitle}>About</h2>
          <div
            className={styles.mainDescription}
            dangerouslySetInnerHTML={{ __html: sanitizeRich(company?.description) }}
          />
        </section>

        {/* Website */}
        {company?.companyWebsite && company.companyWebsite !== "N/A" && (
          <section aria-labelledby="website-heading">
            <h3 id="website-heading" className={styles.title}>Website</h3>
            <a
              className={styles.link}
              href={company.companyWebsite}
              target="_blank"
              rel="noopener noreferrer"
            >
              {company.companyWebsite}
            </a>
          </section>
        )}

        {/* Turnover */}
        {company?.showTurnover && (
          <section>
            <h3 className={styles.title}>Turnover</h3>
            <p className={styles.description}>{formatTurnover(company.turnover)}</p>
          </section>
        )}

        {/* Product */}
        {company?.productName && (
          <section>
            <h3 className={styles.title}>Product</h3>
            <p className={styles.description}>{company.productName}</p>
          </section>
        )}

        {company?.productVersion && (
          <section>
            <h3 className={styles.title}>Product description</h3>
            <div
              className={styles.description}
              dangerouslySetInnerHTML={{ __html: sanitizeRich(company.productVersion) }}
            />
          </section>
        )}

        {/* Q&A */}
        {answers?.length > 0 && (
          <section aria-labelledby="qa-heading">
            <h3 id="qa-heading" className={styles.title}>More details</h3>
            {answers.map((answer, index) => (
              answer ? (
                <div key={index}>
                  <p className={styles.title}>{questions?.[index]?.body}</p>
                  <p className={styles.description}>{answer}</p>
                </div>
              ) : null
            ))}
          </section>
        )}
      </div>

      {/* Right — logo */}
      <aside className={styles.right}>
        <Image
          src={!company?.logo ? companyImg : cld(company?.logo, { w: 600 })}
          alt={company?.name ? `${company.name} logo` : "Company logo"}
          width={0}
          height={0}
          sizes="100vw"
          style={{ width: "80%", height: "auto", maxHeight: "95%" }}
        />
      </aside>

      {/* Active In */}
      {countries?.length > 0 && (
        <section className={styles.countriesContainer} aria-labelledby="activein-heading">
          <h3 id="activein-heading" className={styles.boldP}>Active In</h3>
          <div className={styles.blueCardsContainer}>
            {(seeMoreActive ? countries : countries.slice(0, 4)).map((country, index) => (
              <div key={index} className={styles.blueCard}>
                <p className={styles.blueCardP}>{country?.name}</p>
              </div>
            ))}
          </div>
          {countries.length > 4 && (
            <button
              onClick={() => setSeeMoreActive(!seeMoreActive)}
              className={styles.seeMoreBlueCards}
              style={{ background: "none", border: "none", cursor: "pointer" }}
            >
              {seeMoreActive ? "See less" : "See more"}
            </button>
          )}
        </section>
      )}
    </article>
  );
};

export default Overview;

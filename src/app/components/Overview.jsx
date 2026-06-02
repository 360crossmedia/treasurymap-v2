"use client";
import { useEffect, useState } from "react";
import styles from "../styles/ProviderPage.module.css";
import { apiGetAllQuestions } from "../service/apiGetAllQuestions";
import { apiGetCompanyAnswers } from "../service/apiGetCompanyAnswers";
import { sanitizeRich } from "../utils/sanitize";

const Overview = ({ companyId, initialCompany }) => {
  const company = initialCompany;
  const [questions, setQuestions] = useState();
  const [answers,   setAnswers]   = useState();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [q, a] = await Promise.all([
        apiGetAllQuestions(),
        apiGetCompanyAnswers(companyId),
      ]);
      if (cancelled) return;
      setQuestions(q?.data);
      setAnswers(a);
    })();
    return () => { cancelled = true; };
  }, [companyId]);

  const hasDescription = company?.description && !company.description.startsWith("N/A");

  return (
    <article>
      {/* About */}
      <section className={styles.card} aria-labelledby="about-heading">
        <h2 id="about-heading" className={styles.sectionH2}>About {company?.name}</h2>
        {hasDescription ? (
          <div
            className={styles.aboutText}
            dangerouslySetInnerHTML={{ __html: sanitizeRich(company.description) }}
          />
        ) : (
          <p className={styles.aboutText} style={{ color: "#9aa3b5" }}>
            No description available yet for this vendor.
          </p>
        )}

        {/* Product */}
        {company?.productVersion && (
          <>
            <h3 className={styles.subTitle}>Product{company?.productName ? ` — ${company.productName}` : ""}</h3>
            <div
              className={styles.aboutText}
              dangerouslySetInnerHTML={{ __html: sanitizeRich(company.productVersion) }}
            />
          </>
        )}

        {/* Q&A */}
        {answers?.some(Boolean) && (
          <>
            <h3 className={styles.subTitle}>More details</h3>
            {answers.map((answer, index) =>
              answer ? (
                <div key={index} style={{ marginBottom: 14 }}>
                  <p style={{ fontWeight: 600, color: "#1e3a5f", marginBottom: 4, fontSize: "0.95rem" }}>
                    {questions?.[index]?.body}
                  </p>
                  <p className={styles.aboutText}>{answer}</p>
                </div>
              ) : null
            )}
          </>
        )}
      </section>
    </article>
  );
};

export default Overview;

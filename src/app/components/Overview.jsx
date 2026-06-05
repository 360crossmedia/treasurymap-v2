"use client";
import styles from "../styles/ProviderPage.module.css";
import { sanitizeRich } from "../utils/sanitize";

const Overview = ({ initialCompany, qa = [] }) => {
  const company = initialCompany;
  const hasDescription = company?.description && !company.description.startsWith("N/A");

  return (
    <article>
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
            <h3 className={styles.subTitle}>Product{company?.productName ? ` · ${company.productName}` : ""}</h3>
            <div
              className={styles.aboutText}
              dangerouslySetInnerHTML={{ __html: sanitizeRich(company.productVersion) }}
            />
          </>
        )}

        {/* Q&A · server-rendered */}
        {qa.length > 0 && (
          <>
            <h3 className={styles.subTitle}>More details</h3>
            {qa.map((item, i) => (
              <div key={i} style={{ marginBottom: 14 }}>
                <p style={{ fontWeight: 600, color: "#1e3a5f", marginBottom: 4, fontSize: "0.95rem" }}>
                  {item.question}
                </p>
                <p className={styles.aboutText}>{item.answer}</p>
              </div>
            ))}
          </>
        )}
      </section>
    </article>
  );
};

export default Overview;

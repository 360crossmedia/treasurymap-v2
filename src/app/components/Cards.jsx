"use client";
import Image from "next/image";
import styles from "../styles/Insights.module.css";

const Cards = () => {
  return (
    <>
      <div className={styles.card}>
        <div>
          <Image
            src="https://luxembourgofficial.com/wp-content/uploads/2023/08/Screenshot-2023-08-04-190435.png"
            alt=""
            width="300"
            height="300"
            className={styles.cardImage}
          />
        </div>
        <div>
          <h4 className={styles.mainTitle}>
            PEAK ! – Interview with Muriel Morbé (House of Training)
          </h4>
          <p className={styles.articleDate}>by muzammil August 4, 2023·…</p>
        </div>
      </div>
      <div className={styles.twoCardsContainer}>
        <div className={styles.twoCards}>
          <div className={styles.miniCard}>
            <div>
              <Image
                src="https://luxembourgofficial.com/wp-content/uploads/2024/02/shutterstock_2398156381-480x384.jpeg"
                alt=""
                width="145"
                height="116"
                className={styles.miniCardImage}
              />
            </div>
            <div>
              <h6 className={`${styles.mainTitle} ${styles.bold}`}>
                Mistral AI: The Tech Firm That Reached $2 Billion In One Year
              </h6>
              <p className={styles.articleDate}>February 26, 2024</p>
            </div>
          </div>
          <div className={styles.miniCard}>
            <div>
              <Image
                src="https://luxembourgofficial.com/wp-content/uploads/2023/08/42e0ed_f2735a6744d84f23a80dd82d5ced2124mv2-480x373.jpeg"
                alt=""
                width="145"
                height="116"
                className={styles.miniCardImage}
              />
            </div>
            <div>
              <h6 className={`${styles.mainTitle} ${styles.bold}`}>
                Chris Hayward (City of London): The High Tech Future of
                Post-Brexit Finance
              </h6>
              <p className={styles.articleDate}>February 26, 2024</p>
            </div>
          </div>
        </div>
        <div className={styles.line2}></div>
      </div>
      <div className={styles.card}>
        <p className={styles.topReadText}>Top Read</p>
        <div>
          <Image
            src="https://luxembourgofficial.com/wp-content/uploads/2024/02/Capture-decran-2024-02-07-a-14.13.16-1024x580.png"
            alt=""
            width="300"
            height="300"
            className={styles.cardImage}
          />
        </div>
        <div>
          <h4 className={styles.mainTitle}>
            Luxembourg Official – Interview with Luc Falempin (Tokeny)
          </h4>
          <p className={styles.secondaryArticleBody}>
            https://www.youtube.com/watch?v=r24bC2rncnQ&t=7s Luc Falempin, CEO
            and Founder of Tokeny Solutions, says the pace of tokenization is
            accelerating. He says the digital representation of…
          </p>
        </div>
      </div>
    </>
  );
};

export default Cards;

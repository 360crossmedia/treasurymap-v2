"use client";
import Image from "next/image";
import styles from "../styles/Insights.module.css";

const Cards = () => {
  return (
    <>
      <div className={styles.card}>
        <div>
          <Image
            src="https://www.drrosysandhu.com/wp-content/uploads/2024/03/Spring-skincare-1-150x150.jpg"
            alt=""
            width="70"
            height="70"
          />
        </div>
        <div>
          <p className={styles.articleDate}>March 18, 2024</p>
          <p className={styles.articleTitle}>
            GLOWING SKIN ESSENTIALS: THE 3 MUST-HAVE SKINCARE INGREDIENTS YOU
            NEED
          </p>
        </div>
      </div>
      <div className={styles.card}>
        <div>
          <Image
            src="https://www.drrosysandhu.com/wp-content/uploads/2024/03/Combating-hair-loss-150x150.jpg"
            alt=""
            width="70"
            height="70"
          />
        </div>
        <div>
          <p className={styles.articleDate}>March 1, 2024</p>
          <p className={styles.articleTitle}>
            IMPROVE HAIR LOSS: EFFECTIVE SOLUTIONS FOR MEN AND WOMEN – EXPERT
            ADVICE
          </p>
        </div>
      </div>
      <div className={styles.card}>
        <div>
          <Image
            src="https://www.drrosysandhu.com/wp-content/uploads/2024/02/Under-eye-image-2-150x150.png"
            alt=""
            width="70"
            height="70"
          />
        </div>
        <div>
          <p className={styles.articleDate}>February 26, 2024</p>
          <p className={styles.articleTitle}>
            SAY GOODBYE TO DARK CIRCLES: EFFECTIVE STRATEGIES FOR A YOUTHFUL,
            REFRESHED LOOK
          </p>
        </div>
      </div>
      <div className={styles.card}>
        <div>
          <Image
            src="https://www.drrosysandhu.com/wp-content/uploads/2024/01/Skincare-trands-2024-150x150.png"
            alt=""
            width="70"
            height="70"
          />
        </div>
        <div>
          <p className={styles.articleDate}>January 26, 2024</p>
          <p className={styles.articleTitle}>
            LOOKING AT THE YEAR AHEAD IN BEAUTY – THE IN AND OUT SKINCARE TRENDS
            OF 2024
          </p>
        </div>
      </div>
      <div className={styles.card}>
        <div>
          <Image
            src="https://www.drrosysandhu.com/wp-content/uploads/2024/03/Spring-skincare-1-150x150.jpg"
            alt=""
            width="70"
            height="70"
          />
        </div>
        <div>
          <p className={styles.articleDate}>March 18, 2024</p>
          <p className={styles.articleTitle}>
            GLOWING SKIN ESSENTIALS: THE 3 MUST-HAVE SKINCARE INGREDIENTS YOU
            NEED
          </p>
        </div>
      </div>
      <div className={styles.card}>
        <div>
          <Image
            src="https://www.drrosysandhu.com/wp-content/uploads/2024/03/Combating-hair-loss-150x150.jpg"
            alt=""
            width="70"
            height="70"
          />
        </div>
        <div>
          <p className={styles.articleDate}>March 1, 2024</p>
          <p className={styles.articleTitle}>
            IMPROVE HAIR LOSS: EFFECTIVE SOLUTIONS FOR MEN AND WOMEN – EXPERT
            ADVICE
          </p>
        </div>
      </div>
      <div className={styles.card}>
        <div>
          <Image
            src="https://www.drrosysandhu.com/wp-content/uploads/2024/02/Under-eye-image-2-150x150.png"
            alt=""
            width="70"
            height="70"
          />
        </div>
        <div>
          <p className={styles.articleDate}>February 26, 2024</p>
          <p className={styles.articleTitle}>
            SAY GOODBYE TO DARK CIRCLES: EFFECTIVE STRATEGIES FOR A YOUTHFUL,
            REFRESHED LOOK
          </p>
        </div>
      </div>
      <div className={styles.card}>
        <div>
          <Image
            src="https://www.drrosysandhu.com/wp-content/uploads/2024/01/Skincare-trands-2024-150x150.png"
            alt=""
            width="70"
            height="70"
          />
        </div>
        <div>
          <p className={styles.articleDate}>January 26, 2024</p>
          <p className={styles.articleTitle}>
            LOOKING AT THE YEAR AHEAD IN BEAUTY – THE IN AND OUT SKINCARE TRENDS
            OF 2024
          </p>
        </div>
      </div>
    </>
  );
};

export default Cards;

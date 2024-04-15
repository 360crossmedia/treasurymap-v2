"use client";
import Image from "next/image";
import styles from "../styles/footer.module.css";
import footerLocationIcon from "../assets/footerLocationIcon.svg";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerLeft}>
        <Image alt="" src={footerLocationIcon} />
        <p className={styles.footerP}>
          <a
            className={styles.footerLeftLink}
            href="https://www.simplytreasury.com/"
            target="_blank"
          >
            Simply Treasury
          </a>{" "}
          | 1 rue de Chiny, L-1334 Luxembourg
        </p>
      </div>
      <div className={styles.footerRight}>
        <p className={styles.footerLink}>Powered by 360Crossmedia</p>
        <a
          className={styles.footerLink}
          href="https://www.360crossmedia.com/gdpr"
        >
          GPDR
        </a>
      </div>
    </footer>
  );
};

export default Footer;

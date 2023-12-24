"use client";
import Image from "next/image";
import styles from "../styles/footer.module.css";
import footerLocationIcon from "../assets/footerLocationIcon.svg";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerLeft}>
        <Image alt="" src={footerLocationIcon} />
        <p>Simply Treasury |NY 1 rue de Chiny, L-1811 Luxembourg</p>
      </div>
      <div className={styles.footerRight}>
        <a className={styles.footerLink} href="#">
          Privacy
        </a>
        <a className={styles.footerLink} href="#">
          Terms
        </a>
      </div>
    </footer>
  );
};

export default Footer;

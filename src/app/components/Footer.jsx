"use client";
import Image from "next/image";
import styles from "../styles/footerNew.module.css";
import footerLocationIcon from "../assets/footerLocationIcon.svg";
import bnpLogo from "../assets/BNP_logo.png";
import intensumLogo from "../assets/intensum-logo.jpg";
import kantoxLogo from "../assets/Kantox-logo.png";
import crossmediaLogo from "../assets/360cross.png";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.top}>
        {/* Address */}
        <div className={styles.col}>
          <span className={styles.label}>Address</span>
          <div className={styles.address}>
            <Image alt="" src={footerLocationIcon} className={styles.pin} />
            <span className={styles.addressText}>
              <a
                className={styles.addrLink}
                href="https://www.simplytreasury.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Simply Treasury
              </a>
              <br />1 rue de Chiny, L-1334 Luxembourg
            </span>
          </div>
        </div>

        {/* Official partners */}
        <div className={`${styles.col} ${styles.colCenter}`}>
          <span className={styles.label}>Official partners</span>
          <div className={styles.partners}>
            <Image src={bnpLogo} alt="BNP Paribas" width={100} height={30} className={styles.partnerLogo} />
            <span className={styles.dotSep} />
            <Image src={intensumLogo} alt="Intensum" width={100} height={30} className={styles.partnerLogo} />
            <span className={styles.dotSep} />
            <Image src={kantoxLogo} alt="Kantox" width={100} height={30} className={styles.partnerLogoSm} />
          </div>
        </div>

        {/* Powered by */}
        <div className={`${styles.col} ${styles.colRight}`}>
          <span className={styles.label}>Powered by</span>
          <a href="https://www.360crossmedia.com/" target="_blank" rel="noopener noreferrer">
            <Image src={crossmediaLogo} alt="360 Crossmedia" width={90} height={25} className={styles.crossmediaLogo} />
          </a>
        </div>
      </div>

      <div className={styles.divider} />

      <div className={styles.bottom}>
        <span className={styles.copy}>© {year} TreasuryMap · Simply Treasury</span>
        <nav className={styles.links}>
          <a className={styles.link} href="/get-my-list">Build my shortlist</a>
          <span className={styles.linkSep} />
          <a className={styles.link} href="/gdpr">GDPR</a>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;

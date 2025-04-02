"use client";
import Image from "next/image";
// import styles from "../styles/footer.module.css";
import styles from "../styles/footerNew.module.css"
import footerLocationIcon from "../assets/footerLocationIcon.svg";
import bnpLogo from "../assets/BNP_logo.png"
import intensumLogo from "../assets/intensum-logo.jpg"
import kantoxLogo from "../assets/Kantox-logo.png"
import crossmediaLogo from "../assets/360cross.png"

const Footer = () => {
  return (

    <footer className={styles.footer}>

      <div className={styles.leftSection}>
        
        <div className={styles.leftInnerOne}>
          <span className={styles.grayText}>Official partners</span>
          <Image 
            src={bnpLogo}
            alt="BNP Paribas"
            width={100}
            height={30}
            className={styles.bnpLogo}
          />
          <Image 
            src={intensumLogo}
            alt="Intensum"
            width={100}
            height={30}
            className={styles.bnpLogo}
          />
          <Image 
            src={kantoxLogo}
            alt="Kantox"
            width={100}
            height={30}
            className={styles.kantoxLogo}
          />          
        </div>

        <div className={styles.leftInnerTwo}>
          <a className={styles.gdprText} href="/gdpr" >GDPR</a>
        </div>

      </div>     


      <div className={styles.centerSection}>
        <Image alt="" src={footerLocationIcon} />
        <span className={styles.addressText}>
          Simply Treasury | 1 rue de Chiny, L-1334 Luxembourg
        </span>
      </div>


      <div className={styles.rightSection}>
        
        <span className={styles.grayText}>Powered by</span>
        
        <a href="https://www.360crossmedia.com/" target="_blank">
          <Image 
            src={crossmediaLogo}
            alt="360 Crossmedia"
            width={90}
            height={25}
            className={styles.crossmediaLogo}
          />
        </a>

        
      </div>




    </footer>





    // <footer className={styles.footer}>
    //   <div className={styles.footerLeft}>
    //     <Image alt="" src={footerLocationIcon} />
    //     <p className={styles.footerP}>
    //       <a
    //         className={styles.footerLeftLink}
    //         href="https://www.simplytreasury.com/"
    //         target="_blank"
    //       >
    //         Simply Treasury
    //       </a>{" "}
    //       | 1 rue de Chiny, L-1334 Luxembourg
    //     </p>
    //   </div>
    //   <div className={styles.footerRight}>
    //     <p className={styles.footerLink}>Powered by 360Crossmedia</p>
    //     <a className={styles.footerLink} href="/gdpr">
    //       GPDR
    //     </a>
    //   </div>
    // </footer>
  );
};

export default Footer;

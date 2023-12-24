"use client";
import styles from "../styles/contactUs.module.css";
import Image from "next/image";
import inputEmailIcon from "../assets/inputEmailIcon.svg";
import contactUserIcon from "../assets/contactUserIcon.svg";
import footerLocationIcon from "../assets/footerLocationIcon.svg";
import phoneIcon from "../assets/phoneIcon.svg";
import emailContactIcon from "../assets/emailContactIcon.svg";

const ContactUs = () => {
  return (
    <div className={styles.cardContainer}>
      <div className={styles.cardLeft}>
        <div className={styles.cardTop}>
          <p className={styles.title}>Who we are</p>
          <p className={styles.description}>
            François Masquelier, Senior Vice President & Head of Treasury and
            Enterprise Risk Management at RTL has been associated with Corporate
            treasury for the past 20 years. He had notable successes both in his
            corporate role and in the wider profession as Chairman of ATEL
            (Association des Trésoriers d Entreprise de Luxembourg), and
            ViceChairman of EACT (European Association of Corporate Treasurers).
            He has gone on to become one of the most influential treasurers in
            the profession
          </p>
        </div>
        <div className={styles.cardBottom}>
          <div className={styles.links}>
            <div className={styles.grayCircle}>
              <Image src={phoneIcon} alt="" width={25} height={25} />
            </div>
            <p>+33 125 455 45</p>
          </div>
          <div className={styles.links}>
            <div className={styles.grayCircle}>
              <Image src={emailContactIcon} alt="" width={25} height={25} />
            </div>
            <p>Email</p>
          </div>
          <div className={styles.links}>
            <div className={styles.grayCircle}>
              <Image src={footerLocationIcon} alt="" />
            </div>
            <p>Address</p>
          </div>
        </div>
      </div>
      <div className={styles.card}>
        <div>
          <p className={styles.cardTitle}>Contact Us</p>
          <p className={styles.cardDescription}>
            Figma ipsum component variant main layer.
          </p>
        </div>
        <div className={styles.inputContainer}>
          <Image className={styles.icon} src={contactUserIcon} alt="" />
          <input className={styles.input} placeholder="Name" type="text" />
        </div>
        <div className={styles.inputContainer}>
          <Image className={styles.icon} src={inputEmailIcon} alt="" />
          <input
            className={styles.input}
            placeholder="Email Address"
            type="text"
          />
        </div>
        <div className={styles.inputContainer}>
          <Image className={styles.icon} src={inputEmailIcon} alt="" />
          <input
            className={styles.input}
            placeholder="Company Name"
            type="text"
          />
        </div>
        <div className={styles.inputContainer}>
          <textarea
            className={`${styles.input} ${styles.inputTextArea}`}
            placeholder="Message"
            name=""
            id=""
            cols="30"
            rows="10"
          ></textarea>
        </div>
        <div>
          <button className={styles.button}>Submit</button>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;

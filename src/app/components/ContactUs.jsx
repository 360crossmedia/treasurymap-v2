"use client";
import styles from "../styles/contactUs.module.css";
import Image from "next/image";
import inputEmailIcon from "../assets/inputEmailIcon.svg";
import contactUserIcon from "../assets/contactUserIcon.svg";
import footerLocationIcon from "../assets/footerLocationIcon.svg";
import phoneIcon from "../assets/phoneIcon.svg";
import emailContactIcon from "../assets/emailContactIcon.svg";
import { useState } from "react";
import { apiSendEmail } from "../service/apiSendEmail";
import { setIsLoading } from "../store/slices/isLoading.slice";
import { useDispatch } from "react-redux";

const ContactUs = () => {
  const dispatch = useDispatch();
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [company, setCompany] = useState();
  const [message, setMessage] = useState();

  const submit = async () => {
    if (!name || !email || !company || !message) {
      alert("Please fill in all the fields");
    } else {
      dispatch(setIsLoading(true));
      const result = await apiSendEmail({ name, email, company, message });
      if (result.status == 200) {
        alert("Your message has been sent successfully");
        setName("");
        setEmail("");
        setCompany("");
        setMessage("");
        dispatch(setIsLoading(false));
      } else {
        console.log(result);
        dispatch(setIsLoading(false));
      }
    }
  };

  return (
    <div className={styles.cardContainer}>
      <div className={styles.cardLeft}>
        <div className={styles.cardTop}>
          <p className={styles.title}>Who we are</p>
          <div className={styles.contentWrapper}>
            <p className={styles.description}>
              Simply Treasury is a company founded by François Masquelier,
              Senior Vice President & Head of Treasury and Enterprise Risk
              Management at RTL has been associated with Corporate treasury for
              the past 20 years. François Masquelier, had notable successes both
              in his corporate role and in the wider profession as Chairman of
              ATEL (Association des Trésoriers d Entreprise de Luxembourg), and
              Vice Chairman of EACT (European Association of Corporate
              Treasurers). He has gone on to become one of the most influential
              treasurers in the profession.
            </p>
          </div>
        </div>

        <div className={styles.cardBottom}>
          <div className={styles.links}>
            <div className={styles.grayCircle}>
              <Image className={styles.footerCardIcon} src={phoneIcon} alt="" />
            </div>
            <p className={styles.linksP}>+33 125 455 45</p>
          </div>
          <div className={styles.links}>
            <div className={styles.grayCircle}>
              <Image
                className={styles.footerCardIcon}
                src={emailContactIcon}
                alt=""
              />
            </div>
            <p className={styles.linksP}>francois@simplytreasury.com</p>
          </div>
          <div className={styles.links}>
            <div className={styles.grayCircle}>
              <Image
                className={styles.footerLocationIcon}
                src={footerLocationIcon}
                alt=""
              />
            </div>
            <p className={styles.linksP}>1 rue de Chiny, L-1334 Luxembourg</p>
          </div>
        </div>
      </div>
      <div className={styles.card}>
        <div>
          <p className={styles.cardTitle}>Contact Us</p>
        </div>
        <div className={styles.inputContainer}>
          <Image className={styles.icon} src={contactUserIcon} alt="" />
          <input
            className={styles.input}
            placeholder="Name"
            type="text"
            onChange={(e) => setName(e.target.value)}
            value={name}
          />
        </div>
        <div className={styles.inputContainer}>
          <Image className={styles.icon} src={inputEmailIcon} alt="" />
          <input
            className={styles.input}
            placeholder="Email Address"
            type="text"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </div>
        <div className={styles.inputContainer}>
          <Image className={styles.icon} src={inputEmailIcon} alt="" />
          <input
            className={styles.input}
            placeholder="Company Name"
            type="text"
            onChange={(e) => setCompany(e.target.value)}
            value={company}
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
            onChange={(e) => setMessage(e.target.value)}
            value={message}
          ></textarea>
        </div>
        <div>
          <button onClick={submit} className={styles.button}>
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;

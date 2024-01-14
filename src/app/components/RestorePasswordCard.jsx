"use client";
import styles from "../styles/loginCard.module.css";
import Image from "next/image";
import inputEmailIcon from "../assets/inputEmailIcon.svg";
import inputPasswordIcon from "../assets/inputPasswordIcon.svg";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setIsLoading } from "../store/slices/isLoading.slice";
import { apiRestorePassword } from "../service/apiRestorePassword";
import jwt from "jsonwebtoken";
import { apiUpdatePassword } from "../service/apiUpdatePassword";
require("dotenv").config();

const RestorePasswordCard = ({ token }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [validToken, setValidToken] = useState(false);
  const [userId, setUserId] = useState();

  const submit = async () => {
    dispatch(setIsLoading(true));

    if (!validToken) {
      if (email != "") {
        const sendEmail = await apiRestorePassword(email.toLowerCase());
        if (sendEmail?.status == 200) {
          alert("Check your email for restore your password");
          dispatch(setIsLoading(false));
          router.push("/login");
        } else {
          alert("Your email is wrong");
          dispatch(setIsLoading(false));
        }
      } else {
        alert("Please enter your email");
        dispatch(setIsLoading(false));
      }
    } else {
      if (password != password2) {
        alert("Passwords are not the same");
        dispatch(setIsLoading(false));
      } else {
        const updatePassword = await apiUpdatePassword(userId, password);
        if (updatePassword.status == 200) {
          alert("Your password has been updated");
          dispatch(setIsLoading(false));
          router.push("/login");
        } else {
          console.log(updatePassword);
          dispatch(setIsLoading(false));
        }
      }
    }
  };

  const isValidToken = () => {
    dispatch(setIsLoading(true));
    try {
      const decoded = jwt.verify(token, "maptreasurysecret");
      setUserId(decoded?.userId?.id);
      setValidToken(decoded ? true : false);
      dispatch(setIsLoading(false));
    } catch (error) {
      console.log(error);
      setValidToken(false);
      dispatch(setIsLoading(false));
      if (token) alert("Your link expired, request a new one");
    }
  };

  useEffect(() => isValidToken(), []);

  console.log(password, password2);

  return (
    <div className={styles.cardContainer}>
      <div className={styles.card} style={{ gap: "50px" }}>
        <div>
          <p className={styles.cardTitle}>Restore password</p>
          <p className={styles.cardDescription}>
            {validToken
              ? "Please indicate your new password"
              : "Please indicate your email"}
          </p>
        </div>
        {!validToken && (
          <div className={styles.inputContainer}>
            <Image className={styles.icon} src={inputEmailIcon} alt="" />
            <input
              className={styles.input}
              placeholder="Email Address"
              type="text"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        )}
        {validToken && (
          <>
            <div className={styles.inputContainer}>
              <Image className={styles.icon} src={inputPasswordIcon} alt="" />
              <input
                className={styles.input}
                placeholder="Password"
                type="password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className={styles.inputContainer}>
              <Image className={styles.icon} src={inputPasswordIcon} alt="" />
              <input
                className={styles.input}
                placeholder="Confirm Password"
                type="password"
                onChange={(e) => setPassword2(e.target.value)}
              />
            </div>
          </>
        )}
        <div>
          <button onClick={submit} className={styles.button}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default RestorePasswordCard;

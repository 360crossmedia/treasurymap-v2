"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../styles/signupCard.module.css";
import Image from "next/image";
import inputEmailIcon from "../assets/inputEmailIcon.svg";
import inputPasswordIcon from "../assets/inputPasswordIcon.svg";
import inputFullNameIcon from "../assets/person.svg";
import { useDispatch, useSelector } from "react-redux";
import { setIsLoading } from "../store/slices/isLoading.slice";
import { apiGetUserById } from "../service/apiGetUserById";
import { apiUpdateUser } from "../service/apiUpdateUser";
import { apiLogin } from "../service/apiLogin";
import { apiUpdatePassword } from "../service/apiUpdatePassword";

const MyAccountCard = () => {
  const userId = useSelector((state) => state.user);
  const router = useRouter();
  const dispatch = useDispatch();
  const [fullName, setfullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confPassword, setconfPassword] = useState("");
  const [passwordMatch, setPasswordsMatch] = useState(true);
  const [oldPassword, setOldPassowrd] = useState();
  const [oldEmail, setOldEmail] = useState();
  const [error, setError] = useState("");
  let backUpUserId;
  if (typeof window !== "undefined") {
    backUpUserId = localStorage.getItem("userId");
  }

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    checkPasswordsMatch(e.target.value, confPassword);
  };

  const handleConfirmPasswordChange = (e) => {
    setconfPassword(e.target.value);
    checkPasswordsMatch(password, e.target.value);
  };

  const checkPasswordsMatch = (pwd1, pwd2) => {
    setPasswordsMatch(pwd1 === pwd2);
  };

  const updateNameAndEmail = async () => {
    if (!fullName.length || !email.length) {
      return setError("Complete information");
    } else if (!email.includes("@") || !email.includes(".")) {
      return setError("Enter valid email");
    } else {
      dispatch(setIsLoading(true));
      let data = {
        fullName: fullName,
        email: email.toLowerCase(),
      };
      setError("");
      let result = await apiUpdateUser(userId ? userId : backUpUserId, data);
      if (result.status == 200) {
        setOldEmail(email);
        dispatch(setIsLoading(false));
        alert("User updated successfully");
        window.location.reload();
      } else {
        dispatch(setIsLoading(false));
        setError("No se puede actualizar usuario, información incorrecta");
        console.log(result);
      }
    }
  };

  const updatePassword = async () => {
    dispatch(setIsLoading(true));
    const result = await apiLogin({
      email: email == oldEmail ? email.toLowerCase() : oldEmail.toLowerCase(),
      password: oldPassword,
    });
    if (result?.status == 200) {
      const updatePassword = await apiUpdatePassword(
        userId ? userId : backUpUserId,
        password
      );
      if (updatePassword.status == 200) {
        dispatch(setIsLoading(false));
        alert("Password updated successfully");
        window.location.reload();
      } else {
        console.log(updatePassword);
        dispatch(setIsLoading(false));
      }
    } else {
      alert("Wrong old password");
      dispatch(setIsLoading(false));
    }
  };

  const getUserData = async () => {
    const userData = await apiGetUserById(userId ? userId : backUpUserId);
    setOldEmail(userData?.email);
    setEmail(userData?.email);
    setfullName(userData?.fullName);
  };

  useEffect(() => {
    setPasswordsMatch(password == confPassword);
  }, [confPassword, password]);

  useEffect(() => {
    getUserData();
  }, []);

  return (
    <div className={styles.cardContainer}>
      <div className={styles.card}>
        <div>
          <p className={styles.cardTitle}>Account settings</p>
          <p className={styles.cardDescription}>
            You can update your data here
          </p>
        </div>
        <div className={styles.inputContainer}>
          <Image className={styles.icon} src={inputFullNameIcon} alt="" />
          <input
            className={styles.input}
            placeholder="Full Name"
            type="text"
            value={fullName}
            onChange={(e) => setfullName(e.target.value)}
          />
        </div>
        <div className={styles.inputContainer}>
          <Image className={styles.icon} src={inputEmailIcon} alt="" />
          <input
            className={styles.input}
            placeholder="Email Address"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <button
            style={{ marginBottom: "10px" }}
            className={styles.button}
            onClick={updateNameAndEmail}
          >
            Update name and email
          </button>
        </div>
        <div className={styles.inputContainer}>
          <Image className={styles.icon} src={inputPasswordIcon} alt="" />
          <input
            className={styles.input}
            placeholder="Old Password"
            type="password"
            onChange={(e) => setOldPassowrd(e.target.value)}
          />
        </div>
        <div className={styles.inputContainer}>
          <Image className={styles.icon} src={inputPasswordIcon} alt="" />
          <input
            className={`${styles.input} ${styles.removeOutline}`}
            placeholder="New Password"
            type="password"
            value={password}
            style={
              passwordMatch && password.length > 0
                ? { borderColor: "green" }
                : !passwordMatch && password.length > 0
                ? { borderColor: "red" }
                : {}
            }
            onChange={(e) => handlePasswordChange(e)}
          />
        </div>
        <div className={styles.inputContainer}>
          <Image className={styles.icon} src={inputPasswordIcon} alt="" />
          <input
            className={`${styles.input} ${styles.removeOutline}`}
            placeholder="Confirm New Password"
            type="password"
            value={confPassword}
            style={
              passwordMatch && password.length > 0
                ? { borderColor: "green" }
                : !passwordMatch && password.length > 0
                ? { borderColor: "red" }
                : {}
            }
            onChange={(e) => handleConfirmPasswordChange(e)}
          />
        </div>
        <div>
          <button onClick={updatePassword} className={styles.button}>
            Update Password
          </button>
          {!!error.length && <p className={styles.error}>Error: {error}</p>}
        </div>
      </div>
    </div>
  );
};

export default MyAccountCard;

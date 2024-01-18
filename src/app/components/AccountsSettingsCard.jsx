"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../styles/signupCard.module.css";
import { useDispatch } from "react-redux";
import Form from "react-bootstrap/Form";
import { apiGetAllCompanies } from "../service/apiGetAllCompanies";
import { setUserIdToUpdate } from "../store/slices/userIdToUpdate.slice";

const MyAccountCard = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [companies, setCompanies] = useState([]);
  const [isSelectedAnyCompany, setIsSelectedAnyCompany] = useState(false);
  let backUpUserId;
  if (typeof window !== "undefined") {
    backUpUserId = localStorage.getItem("userId");
  }

  const getCompanies = async () => {
    const companies = await apiGetAllCompanies();
    setCompanies(companies);
  };

  useEffect(() => {
    getCompanies();
  }, []);

  return (
    <div className={styles.cardContainer}>
      <div className={styles.card}>
        <div>
          <p className={styles.cardTitle}>Accounts settings</p>
        </div>
        <div>
          <button
            onClick={() => {
              dispatch(setUserIdToUpdate(false));
              localStorage.removeItem("userIdToUpdate");
              router.push("/myaccount");
            }}
            style={{ marginBottom: "10px" }}
            className={styles.button}
          >
            My account
          </button>
        </div>
        <hr style={{ borderTop: "1px dashed", width: "100%" }} />
        <Form.Select
          onChange={(e) => {
            setIsSelectedAnyCompany(
              e.target.value == "Select Company" ? false : e.target.value
            );
          }}
          bsPrefix={`form-select ${styles.input2} ${
            isSelectedAnyCompany ? styles.active : ""
          }`}
        >
          <option>Select Company</option>
          {companies?.map((company, index) => (
            <option key={index} value={company.userId}>
              {company.name}
            </option>
          ))}
        </Form.Select>
        <div>
          <button
            onClick={() => {
              dispatch(setUserIdToUpdate(Number(isSelectedAnyCompany)));
              localStorage.setItem(
                "userIdToUpdate",
                Number(isSelectedAnyCompany)
              );
              router.push("/myaccount");
            }}
            className={styles.button}
          >
            User Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyAccountCard;

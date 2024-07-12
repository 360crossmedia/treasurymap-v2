"use client";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import React, { useEffect } from "react";
import styles from "../../styles/HeaderDashboard.module.css";
import styles2 from "../../styles/HeaderMediaZone.module.css";
import Form from "react-bootstrap/Form";
import { useRouter } from "next/navigation";
import { apiGetAllCompanies } from "@/app/service/apiGetAllCompanies";
import { setCompanyId } from "@/app/store/slices/companyToUpdate.slice";
import { apiGetCompanyData } from "@/app/service/apiGetCompanyData";

const HeaderMediaZone = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const show = useSelector((state) => state.show);
  const [companies, setCompanies] = useState([]);
  const [isSelectedAnyCompany, setIsSelectedAnyCompany] = useState();
  const companyId = useSelector((state) => state.companyId);

  const getCompanySelected = async () => {
    const result = await apiGetCompanyData(companyId);
    setIsSelectedAnyCompany(result);
  };

  const addNew = () => {
    if (show && show != "Select type of media") {
      show == "videos"
        ? router.push("/mediaZone/video")
        : router.push("/mediaZone/article");
    } else alert("Please select any type of media");
  };

  const getCompanies = async () => {
    const companies = await apiGetAllCompanies();
    setCompanies(companies);
  };

  useEffect(() => {
    getCompanySelected();
    getCompanies();
  }, []);

  return (
    <div className={styles.mainContainer}>
      <p className={styles.title}>Publications control</p>
      {/* <div className={`${styles.selectContainer} ${styles2.selectContainer}`}>
        <Form.Select
          onChange={(e) => {
            setIsSelectedAnyCompany(
              e.target.value == "Select Company" ? false : e.target.value
            );
            dispatch(
              setCompanyId(
                e.target.value == "Select Company"
                  ? false
                  : Number(e.target.value)
              )
            );
          }}
          bsPrefix={`form-select ${styles.input} ${
            isSelectedAnyCompany ? styles.active : ""
          }`}
        >
          <option>Select Company</option>
          {companies?.map((company, index) => (
            <option key={index} value={company.id}>
              {company.name}
            </option>
          ))}
        </Form.Select>
        <div className={styles.buttonsContainer}>
          <button onClick={addNew} className={styles.updateButton}>
            Add New
          </button>
        </div>
      </div> */}
    </div>
  );
};

export default HeaderMediaZone;

"use client";
import { useDispatch, useSelector } from "react-redux";
import styles from "../styles/BodyDashboard.module.css";
import { useRouter } from "next/navigation";
import { setCompanyId } from "../store/slices/companyToUpdate.slice";
import { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import { Form } from "react-bootstrap";
import { apiGetAllCompanies } from "../service/apiGetAllCompanies";
import { RadioButton } from "primereact/radiobutton";
import { apiGetAllVideosByCompanyId } from "../service/apiGetAllVideosByCompanyId";
import { apiGetAllArticlesByCompanyId } from "../service/apiGetAllArticlesByCompanyId";
import { setIsLoading } from "../store/slices/isLoading.slice";
import { apiUpdateMainPublication } from "../service/apiUpdateMainPublication";
import { haveMediaContentToShow } from "../utils";

const BodyDashboard = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const companyId = useSelector((state) => state.companyId);
  const userId = useSelector((state) => state.user);
  const [backUpUserId, setBackUpUserId] = useState();
  const [show, setShow] = useState(false);
  const [companies, setCompanies] = useState();
  const [isSelectedAnyCompany, setIsSelectedAnyCompany] = useState(false);
  const [videos, setVideos] = useState([]);
  const [articles, setArticles] = useState([]);
  const [publicationSelected, setPublicationSelected] = useState(false);
  const [publicationSelectedIsAnArticle, setPublicationSelectedIsAnArticle] =
    useState();
  const [mediaContentToShow, setMediaContentToShow] = useState();

  useEffect(() => {
    if (typeof window !== "undefined") {
      setBackUpUserId(Number(localStorage.getItem("userId")));
    }
    getAllCompanies();
  }, []);

  useEffect(() => {
    if (isSelectedAnyCompany) {
      getVideosAndArticles();
    }
  }, [isSelectedAnyCompany]);

  const getAllCompanies = async () => {
    const companies = await apiGetAllCompanies();
    setCompanies(companies);
  };

  const getVideosAndArticles = async () => {
    dispatch(setIsLoading(true));
    const videos = await apiGetAllVideosByCompanyId(isSelectedAnyCompany);
    const articles = await apiGetAllArticlesByCompanyId(isSelectedAnyCompany);
    setMediaContentToShow(haveMediaContentToShow(videos, articles));
    setVideos(videos);
    setArticles(articles);
    dispatch(setIsLoading(false));
  };

  const handleHideModal = () => {
    setShow(false);
    setIsSelectedAnyCompany(false);
    setArticles([]);
    setVideos([]);
    setPublicationSelected(false);
  };

  const updateMainPublication = async () => {
    dispatch(setIsLoading(true));
    const data = {
      publicationId: publicationSelected,
      isArticle: publicationSelectedIsAnArticle,
    };
    const result = await apiUpdateMainPublication(data);
    if (result.status == 200) {
      alert("Main publication updated successfully");
      handleHideModal();
      dispatch(setIsLoading(false));
    } else {
      alert("Error updating main publication");
      handleHideModal();
      dispatch(setIsLoading(false));
    }
  };

  return (
    <div className={styles.mainContainer}>
      <div
        className={
          userId == 1 || backUpUserId == 1
            ? `${styles.buttonsContainer}`
            : `${styles.buttonsContainer} ${styles.buttonsContainerOwner}`
        }
      >
        <button
          onClick={() =>
            router.push(
              userId == 1 || backUpUserId == 1
                ? "/accountsettings"
                : "/myaccount"
            )
          }
          className={`${styles.mediaZoneButton} ${styles.colorWhite}`}
        >
          {userId == 1 || backUpUserId == 1
            ? "Accounts settings"
            : "My Account"}
        </button>
        <button
          onClick={() => {
            companyId
              ? router.push("/mediaZone")
              : alert("Please select any company");
            localStorage.setItem("companyId", companyId);
          }}
          className={styles.mediaZoneButton}
        >
          Media Zone
        </button>
      </div>
      {(userId == 1 || backUpUserId == 1) && (
        <>
          <div className={styles.linesContainer}>
            <div className={styles.line}></div>
            <p className={styles.or}>Or</p>
            <div className={styles.line}></div>
          </div>
          <div className={styles.buttonsContainer2}>
            <button
              onClick={() => {
                localStorage.removeItem("companyId");
                dispatch(setCompanyId(false));
                router.push("/form");
              }}
              className={styles.createCompanyButton}
            >
              Create a new company
            </button>
            <div className={styles.line2}></div>
            <button
              onClick={() => router.push("/publicationsControl")}
              className={styles.createCompanyButton}
            >
              Publications control
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default BodyDashboard;

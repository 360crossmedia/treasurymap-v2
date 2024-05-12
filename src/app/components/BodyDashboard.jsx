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
              onClick={() => {
                setShow(true);
              }}
              className={styles.createCompanyButton}
            >
              Select main publication
            </button>
          </div>
          {show && (
            <Modal
              aria-labelledby="contained-modal-title-vcenter"
              centered
              show={show}
              onHide={handleHideModal}
              size="lg"
            >
              <Modal.Header closeButton>
                <Modal.Title>Main publication for Insights</Modal.Title>
              </Modal.Header>
              <Modal.Body className={styles.moreCountriesContainer}>
                <Form.Select
                  onChange={(e) => {
                    setIsSelectedAnyCompany(
                      e.target.value == "Select Company"
                        ? false
                        : e.target.value
                    );
                  }}
                >
                  <option>Select Company</option>
                  {companies?.map((company, index) => (
                    <option key={index} value={company.id}>
                      {company.name}
                    </option>
                  ))}
                </Form.Select>
                <div className={styles.linesContainer}>
                  <div className={styles.line}></div>
                  <p className={styles.or}>O</p>
                  <div className={styles.line}></div>
                </div>
                <div className={styles.radioButtonsContainer}>
                  {videos?.map(
                    (video, index) =>
                      video.live && (
                        <div className={styles.inputsContianer} key={index}>
                          <RadioButton
                            inputId={`input-video-${index}`}
                            value={publicationSelected}
                            onChange={(e) => {
                              setPublicationSelectedIsAnArticle(false);
                              setPublicationSelected(video?.id);
                            }}
                            checked={
                              video?.id === publicationSelected &&
                              publicationSelectedIsAnArticle == false
                            }
                          />
                          <label
                            className={styles.modalLabel}
                            htmlFor={`input-video-${index}`}
                          >
                            <span className={styles.modalLink}>(Video)</span>
                            {video?.title}{" "}
                            <a
                              className={styles.modalLink}
                              href={`/publication/video/${video?.id}`}
                              target="_blank"
                            >
                              View Publication
                            </a>
                          </label>
                        </div>
                      )
                  )}
                  {articles?.map(
                    (article, index) =>
                      article.live && (
                        <div className={styles.inputsContianer} key={index}>
                          <RadioButton
                            inputId={`input-article-${index}`}
                            value={publicationSelected}
                            onChange={() => {
                              setPublicationSelectedIsAnArticle(true);
                              setPublicationSelected(article?.id);
                            }}
                            checked={
                              article?.id === publicationSelected &&
                              publicationSelectedIsAnArticle == true
                            }
                          />
                          <label
                            className={styles.modalLabel}
                            htmlFor={`input-article-${index}`}
                          >
                            <span className={styles.modalLink}>(Article)</span>
                            {article?.title}{" "}
                            <a
                              className={styles.modalLink}
                              href={`/publication/article/${article?.id}`}
                              target="_blank"
                            >
                              View Publication
                            </a>
                          </label>
                        </div>
                      )
                  )}
                </div>
                {isSelectedAnyCompany && !mediaContentToShow && (
                  <h6>This company has no live publications.</h6>
                )}
                {isSelectedAnyCompany && (
                  <div className={styles.buttonsContainer}>
                    <button
                      onClick={handleHideModal}
                      className={styles.updateButton}
                    >
                      Back
                    </button>
                    <button
                      onClick={updateMainPublication}
                      className={styles.updateButton}
                    >
                      Save
                    </button>
                  </div>
                )}
              </Modal.Body>
            </Modal>
          )}
        </>
      )}
    </div>
  );
};

export default BodyDashboard;

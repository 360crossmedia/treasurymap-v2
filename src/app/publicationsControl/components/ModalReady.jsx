import { apiGetAllCompanies } from "@/app/service/apiGetAllCompanies";
import { RadioButton } from "primereact/radiobutton";
import { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import styles from "../../styles/BodyDashboard.module.css";
import { useDispatch } from "react-redux";
import { haveMediaContentToShow } from "@/app/utils";
import { setIsLoading } from "@/app/store/slices/isLoading.slice";
import { apiGetAllVideosByCompanyId } from "@/app/service/apiGetAllVideosByCompanyId";
import { apiGetAllArticlesByCompanyId } from "@/app/service/apiGetAllArticlesByCompanyId";
import { apiUpdateMainPublication } from "@/app/service/apiUpdateMainPublication";

const ModalReady = ({ show, setShow, mainPublicationId }) => {
  const [companies, setCompanies] = useState();
  const [isSelectedAnyCompany, setIsSelectedAnyCompany] = useState();
  const [mediaContentToShow, setMediaContentToShow] = useState();
  const [videos, setVideos] = useState();
  const [articles, setArticles] = useState();
  const [publicationSelected, setPublicationSelected] = useState();
  const [publicationSelectedIsAnArticle, setPublicationSelectedIsAnArticle] =
    useState();
  const dispatch = useDispatch();

  const getAllCompanies = async () => {
    dispatch(setIsLoading(true));
    const response = await apiGetAllCompanies();
    setCompanies(response);
    dispatch(setIsLoading(false));
  };

  const handleHideModal = () => {
    setShow(false);
  };

  const updateMainPublication = async () => {
    dispatch(setIsLoading(true));
    const data = {
      publicationId: publicationSelected,
      isArticle: publicationSelectedIsAnArticle,
    };
    const result = await apiUpdateMainPublication(mainPublicationId, data);
    if (result?.status == 200) {
      alert("Main publication updated successfully");
      handleHideModal();
      dispatch(setIsLoading(false));
      window.location.reload();
    } else {
      alert("Error updating main publication");
      handleHideModal();
      dispatch(setIsLoading(false));
    }
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

  useEffect(() => {
    getAllCompanies();
  }, []);

  useEffect(() => {
    if (isSelectedAnyCompany) {
      getVideosAndArticles();
    }
  }, [isSelectedAnyCompany]);

  return (
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
              e.target.value == "Select Company" ? false : e.target.value
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
            <button onClick={handleHideModal} className={styles.updateButton}>
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
  );
};

export default ModalReady;

"use client";
import { useEffect, useState } from "react";
import styles from "../../styles/BodyDashboard.module.css";
import styles2 from "../../styles/BodyMediaZone.module.css";
import styles3 from "../styles/main.module.css";
import { useDispatch } from "react-redux";
import { setIsLoading } from "../../store/slices/isLoading.slice";
import { truncateHtmlString } from "../../utils";
import ModalReady from "./ModalReady";
import { apiGetMainPublications } from "@/app/service/apiGetMainPublication";

const BodyPublicationsControl = () => {
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);
  const [mainPublications, setMainPublications] = useState();
  const [mainPublicationId, setMainPublicationId] = useState();

  const getMainPublications = async () => {
    const result = await apiGetMainPublications();
    setMainPublications(result);
  };

  const handleShowModal = (mainPublicationId) => {
    setMainPublicationId(mainPublicationId);
    setShow(true);
  };

  useEffect(() => {
    dispatch(setIsLoading(true));
    getMainPublications();
  }, []);

  useEffect(() => {
    if (mainPublications) {
      dispatch(setIsLoading(false));
    }
  }, [mainPublications]);

  return (
    <div
      className={`${styles.mainContainer} ${styles2.mainContainer} ${styles3.mainContainer}`}
    >
      <div>
        <div
          className={`${styles2.videosList} ${styles2.headerList} ${styles3.fullWidth}`}
        >
          <p className={styles2.headerP}>N°</p>
          <p className={styles2.headerP}>Creation Date</p>
        </div>
        {mainPublications?.map((publication, index) => (
          <div key={index} className={styles2.videosList}>
            <div className={styles2.checkboxContainer}>
              <p className={styles2.videoP}>{index}</p>
              <label
                htmlFor={`input-article-${index}`}
                className={`ml-2 ${styles2.videoP}`}
              >
                <span className={styles.modalLink}>
                  {publication?.url ? "(Video)" : "(Article)"}
                </span>
                {truncateHtmlString(publication.title, 80)}
                <a
                  className={styles2.modalLink}
                  href={`/publication/article/${publication?.id}`}
                  target="_blank"
                >
                  View Publication
                </a>
              </label>
            </div>
            <div>
              <button
                className={styles3.updateButton}
                onClick={() => handleShowModal(index + 1)}
              >
                Change
              </button>
            </div>
          </div>
        ))}
      </div>
      {show == true && (
        <ModalReady
          show={show}
          setShow={setShow}
          mainPublicationId={mainPublicationId}
        />
      )}
    </div>
  );
};

export default BodyPublicationsControl;

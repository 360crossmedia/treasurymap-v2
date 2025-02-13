import { useEffect, useState } from "react";
import styles from "../styles/HeaderDashboard.module.css";
import Form from "react-bootstrap/Form";
import { useDispatch, useSelector } from "react-redux";
import { apiGetCompaniesByOwner } from "../service/apiGetCompaniesByOwner";
import { useRouter } from "next/navigation";
import { apiDeleteCompanyById } from "../service/apiDeleteCompanyById";
import { setCompanyId } from "../store/slices/companyToUpdate.slice";
import { apiGetAllCompanies } from "../service/apiGetAllCompanies";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { apiGetCompanyHasMedia } from "../service/apiGetCompanyHasMedia";

const HeaderDashboard = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const userId = useSelector((state) => state.user);
  const [backUpUserId, setBackUpUserId] = useState();
  const [companies, setCompanies] = useState([]);
  const [isSelectedAnyCompany, setIsSelectedAnyCompany] = useState(false);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setBackUpUserId(Number(localStorage.getItem("userId")));
      getCompanies(Number(localStorage.getItem("userId")));
    }
  }, []);

  const getCompanies = async (id) => {
    if (id == 1) {
      const companies = await apiGetAllCompanies();
      setCompanies(companies);
    } else {
      const companies = await apiGetCompaniesByOwner(id);
      setCompanies(companies);
    }
  };

  const updateButton = () => {
    if (isSelectedAnyCompany) {
      dispatch(setCompanyId(Number(isSelectedAnyCompany)));
      localStorage.setItem("companyId", Number(isSelectedAnyCompany));
      router.push(`/form`);
    } else alert("Please select any company");
  };

  const deleteButton = async () => {
    if (isSelectedAnyCompany) {
      const result = await apiDeleteCompanyById(isSelectedAnyCompany);
      if (result?.status == 200) {
        alert("Company deleted");
        window.location.reload();
      }
    } else alert("Please select any company");
  };

  const showModal = () => {
    setShow((prev) => !prev);
  };

  const companyHasMedia = async () => {
    const result = await apiGetCompanyHasMedia(isSelectedAnyCompany);
    if (result) showModal();
    else deleteButton();
  };

  return (
    <div className={styles.mainContainer}>
      <p className={styles.title}>Company Admin</p>
      <div className={styles.selectContainer}>
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
          <button onClick={updateButton} className={styles.updateButton}>
            Update
          </button>
          {(userId == 1 || backUpUserId == 1) && (
            <button onClick={companyHasMedia} className={styles.deleteButton}>
              Delete
            </button>
          )}
        </div>
      </div>
      {show && (
        <div className={`${styles.modal} modal show`}>
          <Modal.Dialog>
            <Modal.Header onClick={showModal} closeButton>
              <Modal.Title>Detele company</Modal.Title>
            </Modal.Header>

            <Modal.Body>
              <p>
                This company owns media. Deleting it will also delete its media.
                Are you sure you want to proceed?
              </p>
            </Modal.Body>

            <Modal.Footer>
              <Button onClick={showModal} variant="secondary">
                Close
              </Button>
              <Button onClick={deleteButton} variant="danger">
                Delete
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </div>
      )}
    </div>
  );
};

export default HeaderDashboard;

import { useSelector, useDispatch } from "react-redux";
import React from "react";
import styles from "../styles/HeaderDashboard.module.css";
import styles2 from "../styles/HeaderMediaZone.module.css";
import Form from "react-bootstrap/Form";
import { setShow } from "../store/slices/show.slice";
import { useRouter } from "next/navigation";

const HeaderMediaZone = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const show = useSelector((state) => state.show);

  const addNew = () => {
    if (show && show != "Select type of media") {
      show == "videos"
        ? router.push("/mediaZone/video")
        : router.push("/mediaZone/article");
    } else alert("Please select any type of media");
  };

  return (
    <div className={styles.mainContainer}>
      <p className={styles.title}>Media Zone</p>
      <div className={`${styles.selectContainer} ${styles2.selectContainer}`}>
        <Form.Select
          onChange={(e) => dispatch(setShow(e.target.value))}
          bsPrefix={`form-select ${styles.input}`}
        >
          <option>Select type of media</option>
          <option value="videos">Videos</option>
          <option value="articles">Articles</option>
        </Form.Select>
        <div className={styles.buttonsContainer}>
          <button onClick={addNew} className={styles.updateButton}>
            Add New
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeaderMediaZone;

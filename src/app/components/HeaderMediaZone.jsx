import React from "react";
import styles from "../styles/HeaderDashboard.module.css";
import styles2 from "../styles/HeaderMediaZone.module.css";
import Form from "react-bootstrap/Form";

const HeaderMediaZone = () => {
  return (
    <div className={styles.mainContainer}>
      <p className={styles.title}>Media Zone</p>
      <div className={`${styles.selectContainer} ${styles2.selectContainer}`}>
        <Form.Select bsPrefix={`form-select ${styles.input}`}>
          <option>Select type of media</option>
          <option value="1">Media 1</option>
          <option value="2">Media 2</option>
          <option value="3">Media 3</option>
        </Form.Select>
        <div className={styles.buttonsContainer}>
          <button className={styles.updateButton}>Add New</button>
        </div>
      </div>
    </div>
  );
};

export default HeaderMediaZone;

import React from "react";
import styles from "../styles/HeaderDashboard.module.css";
import Form from "react-bootstrap/Form";

const HeaderDashboard = () => {
  return (
    <div className={styles.mainContainer}>
      <p className={styles.title}>Company Admin</p>
      <div className={styles.selectContainer}>
        <Form.Select bsPrefix={`form-select ${styles.input}`}>
          <option>Select Company</option>
          <option value="1">Company 1</option>
          <option value="2">Company 2</option>
          <option value="3">Company 3</option>
        </Form.Select>
        <div className={styles.buttonsContainer}>
          <button className={styles.updateButton}>Update</button>
          <button className={styles.deleteButton}>Delete</button>
        </div>
      </div>
    </div>
  );
};

export default HeaderDashboard;

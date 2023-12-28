"use client";
import styles from "../styles/BodyArticle.module.css";

const BodyArticle = ({ isArticle }) => {
  return (
    <div className={styles.mainContainer}>
      <form className={styles.card} action="">
        <div className={styles.inputContainer}>
          <label htmlFor="">Title</label>
          <input
            className={styles.input}
            placeholder="Enter year"
            type="text"
          />
        </div>
        {isArticle && (
          <div className={styles.inputContainer}>
            <label htmlFor="">Body</label>
            <textarea
              className={styles.inputTextArea}
              placeholder="Message"
              name=""
              id=""
              cols="30"
              rows="5"
            ></textarea>
          </div>
        )}
        {!isArticle && (
          <div className={styles.inputContainer}>
            <label htmlFor="">URL</label>
            <input
              className={styles.input}
              placeholder="Enter URL"
              type="text"
            />
          </div>
        )}
        <div className={styles.buttonsContainer}>
          <button className={styles.updateButton}>Update</button>
          <button className={styles.deleteButton}>Delete</button>
        </div>
      </form>
    </div>
  );
};

export default BodyArticle;

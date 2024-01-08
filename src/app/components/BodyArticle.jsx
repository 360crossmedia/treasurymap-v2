"use client";
import { useState } from "react";
import { apiCreateVideo } from "../service/apiCreateVideo";
import styles from "../styles/BodyArticle.module.css";
import { useSelector } from "react-redux";
import { apiCreateArticle } from "../service/apiCreateArticle";
import { useRouter } from "next/navigation";

const BodyArticle = ({ isArticle }) => {
  const router = useRouter();
  const [title, setTitle] = useState();
  const [body, setBody] = useState();
  const [url, setUrl] = useState();
  const companyId = useSelector((state) => state.companyId);

  const create = async () => {
    event.preventDefault();
    if (isArticle) {
      if (!title || !body) {
        alert("Complete required fields");
      } else {
        try {
          const result = await apiCreateArticle(companyId, { title, body });
          if (result.status == 201) {
            alert("Article created succesfully");
            router.push("/mediaZone");
          }
        } catch (error) {
          console.log(error);
        }
      }
    } else {
      if (!title || !url) {
        alert("Complete required fields");
      } else {
        const result = await apiCreateVideo(companyId, { title, url });
        if (result.status == 201) {
          alert("Video created succesfully");
          router.push("/mediaZone");
        } else console.log(result);
      }
    }
  };

  return (
    <div className={styles.mainContainer}>
      <form className={styles.card} onSubmit={create}>
        <div className={styles.inputContainer}>
          <label htmlFor="">Title</label>
          <input
            className={styles.input}
            placeholder="Enter title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
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
              value={body}
              onChange={(e) => setBody(e.target.value)}
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
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>
        )}
        <div className={styles.buttonsContainer}>
          <button type="submit" className={styles.updateButton}>
            Create
          </button>
          <button
            type="button"
            onClick={() => router.push("/mediaZone")}
            className={styles.deleteButton}
          >
            Back
          </button>
        </div>
      </form>
    </div>
  );
};

export default BodyArticle;

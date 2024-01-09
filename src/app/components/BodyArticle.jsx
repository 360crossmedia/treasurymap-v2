"use client";
import { useEffect, useState } from "react";
import { apiCreateVideo } from "../service/apiCreateVideo";
import styles from "../styles/BodyArticle.module.css";
import { useDispatch, useSelector } from "react-redux";
import { apiCreateArticle } from "../service/apiCreateArticle";
import { useRouter } from "next/navigation";
import { setIsLoading } from "../store/slices/isLoading.slice";
import { apiGetArticleById } from "../service/apiGetArticleById";
import { apiGetVideoById } from "../service/apiGetVideoById";
import { apiUpdateArticle } from "../service/apiUpdateArticle";
import { apiUpdateVideo } from "../service/apiUpdateVideo";

const BodyArticle = ({ isArticle }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [title, setTitle] = useState();
  const [body, setBody] = useState();
  const [url, setUrl] = useState();
  const [isUpdate, setIsUpdate] = useState(false);
  const companyId = useSelector((state) => state.companyId);
  const videoId = useSelector((state) => state.videoId);
  const articleId = useSelector((state) => state.articleId);

  const save = async () => {
    dispatch(setIsLoading(true));
    event.preventDefault();
    if (!isUpdate) {
      if (isArticle) {
        if (!title || !body) {
          dispatch(setIsLoading(false));
          alert("Complete required fields");
        } else {
          const result = await apiCreateArticle(companyId, { title, body });
          if (result.status == 201) {
            dispatch(setIsLoading(false));
            alert("Article created succesfully");
            router.push("/mediaZone");
          } else {
            console.log(result);
            dispatch(setIsLoading(false));
          }
        }
      } else {
        if (!title || !url) {
          dispatch(setIsLoading(false));
          alert("Complete required fields");
        } else {
          const result = await apiCreateVideo(companyId, { title, url });
          if (result.status == 201) {
            dispatch(setIsLoading(false));
            alert("Video created succesfully");
            router.push("/mediaZone");
          } else {
            console.log(result);
            dispatch(setIsLoading(false));
          }
        }
      }
    } else {
      if (isArticle) {
        if (!title || !body) {
          dispatch(setIsLoading(false));
          alert("Complete required fields");
        } else {
          const result = await apiUpdateArticle(articleId, { title, body });
          if (result.status == 200) {
            dispatch(setIsLoading(false));
            alert("Article updated succesfully");
            router.push("/mediaZone");
          } else {
            console.log(result);
            dispatch(setIsLoading(false));
          }
        }
      } else {
        if (!title || !url) {
          dispatch(setIsLoading(false));
          alert("Complete required fields");
        } else {
          const result = await apiUpdateVideo(videoId, { title, url });
          if (result.status == 200) {
            dispatch(setIsLoading(false));
            alert("Video updated succesfully");
            router.push("/mediaZone");
          } else {
            console.log(result);
            dispatch(setIsLoading(false));
          }
        }
      }
    }
  };

  const getAllInputsData = async () => {
    if (isArticle && articleId) {
      const articleData = await apiGetArticleById(articleId);
      setTitle(articleData.title);
      setBody(articleData.body);
      setIsUpdate(true);
    } else if (!isArticle && videoId) {
      const videoData = await apiGetVideoById(videoId);
      setTitle(videoData.title);
      setUrl(videoData.url);
      setIsUpdate(true);
    }
  };

  useEffect(() => {
    getAllInputsData();
  }, []);

  return (
    <div className={styles.mainContainer}>
      <form className={styles.card} onSubmit={save}>
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
            Save
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

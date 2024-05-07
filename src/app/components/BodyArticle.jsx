"use client";
import styles from "../styles/BodyArticle.module.css";
import stylesForm from "../styles/BodyForm.module.css";
import { useEffect, useState } from "react";
import { apiCreateVideo } from "../service/apiCreateVideo";
import { useDispatch, useSelector } from "react-redux";
import { apiCreateArticle } from "../service/apiCreateArticle";
import { useRouter } from "next/navigation";
import { setIsLoading } from "../store/slices/isLoading.slice";
import { apiGetArticleById } from "../service/apiGetArticleById";
import { apiGetVideoById } from "../service/apiGetVideoById";
import { apiUpdateArticle } from "../service/apiUpdateArticle";
import { apiUpdateVideo } from "../service/apiUpdateVideo";
import {
  formats,
  modules,
  openLinkInNewTab,
  uploadImage,
  stringToArr,
  isThisPublicationMainPublication,
} from "../utils";
import Image from "next/image";
import PhotoImg from "../assets/photoImg.svg";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { apiNewPublicationAlert } from "../service/apiNewPublicationAlert";
import { apiGetCompanyData } from "../service/apiGetCompanyData";
import { Form } from "react-bootstrap";

const BodyArticle = ({ isArticle }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [title, setTitle] = useState();
  const [body, setBody] = useState();
  const [introduction, setIntroduction] = useState();
  const [url, setUrl] = useState();
  const [image, setImage] = useState();
  const [file, setFile] = useState();
  const [fileName, setFileName] = useState();
  const [isUpdate, setIsUpdate] = useState(false);
  const [tags, setTags] = useState([]);
  const [live, setLive] = useState();
  const [isMainPublication, setIsMainPublication] = useState();
  const companyId = useSelector((state) => state.companyId);
  const userId = useSelector((state) => state.user);
  const videoId = useSelector((state) => state.videoId);
  const articleId = useSelector((state) => state.articleId);
  let backUpCompanyId;
  let backUpUserId;
  if (typeof window !== "undefined") {
    backUpCompanyId = localStorage.getItem("companyId");
    backUpUserId = localStorage.getItem("userId");
  }

  const save = async () => {
    dispatch(setIsLoading(true));
    event.preventDefault();
    var coverImage = image.includes("https://")
      ? image
      : await uploadImage(file);
    if (!isUpdate) {
      if (isArticle) {
        if (!title || !body || !image) {
          dispatch(setIsLoading(false));
          alert("Complete required fields");
        } else {
          const result = await apiCreateArticle(
            companyId ? companyId : backUpCompanyId,
            { title, body, coverImage, tags, introduction, live }
          );
          if (result?.status == 201) {
            const sendEmail = await apiNewPublicationAlert({
              companyName: await getCompanyName(),
              title,
              image: coverImage,
            });
            if (sendEmail?.status == 200) {
              dispatch(setIsLoading(false));
              alert("Article created succesfully");
              router.push("/mediaZone");
            } else {
              console.log(result);
              dispatch(setIsLoading(false));
            }
          } else {
            console.log(result);
            dispatch(setIsLoading(false));
          }
        }
      } else {
        if (!title || !url || !image) {
          dispatch(setIsLoading(false));
          alert("Complete required fields");
        } else {
          const result = await apiCreateVideo(
            companyId ? companyId : backUpCompanyId,
            { title, url, coverImage, introduction, tags, live }
          );
          if (result?.status == 201) {
            const sendEmail = await apiNewPublicationAlert({
              companyName: await getCompanyName(),
              title,
              image: coverImage,
            });
            if (sendEmail?.status == 200) {
              dispatch(setIsLoading(false));
              alert("Video created succesfully");
              router.push("/mediaZone");
            } else {
              console.log(result);
              dispatch(setIsLoading(false));
            }
          } else {
            console.log(result);
            dispatch(setIsLoading(false));
          }
        }
      }
    } else {
      if (isArticle) {
        if (!title || !body || !image) {
          dispatch(setIsLoading(false));
          alert("Complete required fields");
        } else if (isMainPublication && !live) {
          dispatch(setIsLoading(false));
          alert(
            "This article is selected as the main publication and cannot be set off."
          );
        } else {
          const result = await apiUpdateArticle(articleId, {
            title,
            body,
            coverImage,
            tags,
            introduction,
            live,
          });
          if (result?.status == 200) {
            dispatch(setIsLoading(false));
            alert("Article updated succesfully");
            router.push("/mediaZone");
          } else {
            console.log(result);
            dispatch(setIsLoading(false));
          }
        }
      } else {
        if (!title || !url || !image) {
          dispatch(setIsLoading(false));
          alert("Complete required fields");
        } else if (isMainPublication && !live) {
          dispatch(setIsLoading(false));
          alert(
            "This article is selected as the main publication and cannot be set off."
          );
        } else {
          const result = await apiUpdateVideo(videoId, {
            title,
            url,
            coverImage,
            introduction,
            tags,
            live,
          });
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

  const getCompanyName = async () => {
    const companyData = await apiGetCompanyData(
      companyId ? companyId : backUpCompanyId
    );
    return companyData?.name;
  };

  const getAllInputsData = async () => {
    if (isArticle && articleId) {
      const thisPublicationIsMainPublication =
        await isThisPublicationMainPublication(isArticle, articleId);
      const articleData = await apiGetArticleById(articleId);
      setTitle(articleData?.title);
      setBody(articleData?.body);
      setImage(articleData?.coverImage);
      setIsUpdate(true);
      setTags(articleData?.tags);
      setLive(articleData?.live);
      setIntroduction(articleData?.introduction);
      setIsMainPublication(thisPublicationIsMainPublication);
    } else if (!isArticle && videoId) {
      const thisPublicationIsMainPublication =
        await isThisPublicationMainPublication(isArticle, videoId);
      const videoData = await apiGetVideoById(videoId);
      setTitle(videoData.title);
      setUrl(videoData.url);
      setImage(videoData?.coverImage);
      setTags(videoData?.tags);
      setLive(videoData?.live);
      setIsUpdate(true);
      setIntroduction(videoData?.introduction);
      setIsMainPublication(thisPublicationIsMainPublication);
    }
  };

  useEffect(() => {
    getAllInputsData();
  }, []);

  return (
    <div className={styles.mainContainer}>
      <form className={styles.card} onSubmit={save}>
        {(userId == 1 || backUpUserId == 1) && (
          <div className={styles.inputContainer}>
            <label>Live</label>
            <Form.Check
              type="switch"
              id="custom-switch"
              label={live ? "On" : "Off"}
              onChange={(e) => setLive(e.target.checked)}
              checked={live}
            />
          </div>
        )}
        <div className={styles.inputContainer}>
          <label>
            Title <span className={styles.required}>*</span>
          </label>
          <input
            required
            className={styles.input}
            placeholder="Enter title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className={styles.inputContainer}>
          <label>
            Cover image <span className={styles.required}>*</span>
          </label>
          <div className={styles.uploadPhotoContainer}>
            <div className={styles.imageContainer}>
              <input
                className={styles.inputFile}
                type="file"
                {...(image ? {} : { required: true })}
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (readerEvent) => {
                      const imageDataUrl = readerEvent.target.result;
                      setImage(imageDataUrl);
                    };
                    reader.readAsDataURL(file);
                    setFileName(
                      file.name.substring(0, 10) +
                        (file.name.length > 10 ? "..." : "")
                    );
                    setFile(file);
                  }
                }}
              />
              {!file ||
                (image?.includes("http://") && (
                  <em className={styles.imageLabel}>Click here!</em>
                ))}
              {!image && (
                <Image
                  src={!image ? PhotoImg : image}
                  alt=""
                  width={0}
                  height={0}
                  style={{
                    width: "150px",
                    maxWidth: "200px",
                    height: "auto",
                    height: "150px",
                    maxHeight: "200px",
                  }}
                />
              )}
              {image && (
                <img
                  src={!image ? PhotoImg : image}
                  alt=""
                  width={0}
                  height={0}
                  style={{
                    width: "100px",
                    height: "auto",
                    maxHeight: "100px",
                  }}
                />
              )}
              <p>
                {fileName}{" "}
                {fileName == "Upload logo" && (
                  <span className={stylesForm.span}>*</span>
                )}
              </p>
            </div>
            <ul style={{ fontSize: "10px" }}>
              <li>Format: PNG</li>
              <li>Background: Transparent</li>
              <li>Minimum Dimensions: 600px width</li>
              <li>Maximum File Size: 2.5MB</li>
              <li>
                Quality: Image should be clear, without pixelation or distortion
              </li>
            </ul>
          </div>
        </div>
        <div className={styles.inputContainer}>
          <label className={styles.label} htmlFor="description">
            {isArticle ? "Introduction" : "Description"}
          </label>
          <textarea
            className={styles.inputTextArea}
            placeholder={
              isArticle
                ? "Enter article introduction"
                : "Enter video description"
            }
            name="description"
            id="description"
            rows="6"
            value={introduction}
            onChange={(e) => setIntroduction(e.target.value)}
            maxLength={500}
          ></textarea>
        </div>
        {isArticle && (
          <>
            <div className={styles.inputContainer}>
              <label>
                Body <span className={styles.required}>*</span>
              </label>
              <ReactQuill
                className={styles.customButton}
                formats={formats}
                modules={modules}
                value={body}
                onChange={setBody}
              />
            </div>
          </>
        )}
        <div className={styles.inputContainer}>
          <label className={styles.label} htmlFor="">
            Insert tags related to the {isArticle ? "article" : "video"}{" "}
            (separated by commas):
          </label>
          <input
            className={styles.input}
            placeholder="Tag 1, tag 2, tag 3"
            type="text"
            value={tags}
            onChange={(e) => stringToArr(e.target.value, setTags)}
          />
        </div>
        {!isArticle && (
          <div className={styles.inputContainer}>
            <label htmlFor="">
              Embed URL
              <span className={styles.required}>*</span>
              <span
                className={styles.urlInstructionsSpan}
                onClick={openLinkInNewTab}
              >
                See how to set the proper URL{" "}
                <span className={styles.urlInstructionsIcon}>&#x1F6C8;</span>
              </span>
            </label>

            <input
              className={styles.input}
              placeholder="Enter URL"
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
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

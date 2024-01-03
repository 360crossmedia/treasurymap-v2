"use client";
import Image from "next/image";
import styles from "../styles/BodyForm.module.css";
import PhotoImg from "../assets/photoImg.svg";
import Form from "react-bootstrap/Form";
import { Checkbox } from "primereact/checkbox";
import { useEffect, useState } from "react";
import { apiCreateCompany } from "../service/apiCreateCompany";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { apiGetCategories } from "../service/apiGetCategories";
import { apiGetSubCategories } from "../service/apiGetSubCategories";

const BodyForm = () => {
  const router = useRouter();
  const [image, setImage] = useState();
  const [fileName, setFileName] = useState("Upload logo");
  const [companyName, setCompanyName] = useState("");
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const userId = useSelector((state) => state.user);

  const submit = async () => {
    const result = await apiCreateCompany({ name: companyName, userId });
    if (result?.status == 201) {
      alert("Company created successfully");
      router.push("/dashboard");
    } else console.log(result);
  };

  const getCategoriesAndSubCategories = async () => {
    const categories = await apiGetCategories();
    const subCategories = await apiGetSubCategories();
    setCategories(categories?.data);
    setSubCategories(subCategories?.data);
  };

  useEffect(() => {
    getCategoriesAndSubCategories();
  }, []);

  return (
    <div className={styles.mainContainer}>
      <div className={styles.uploadPhotoContainer}>
        <div className={styles.card}>
          <input
            className={styles.inputFile}
            type="file"
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
              }
            }}
          />
          <Image
            width={50}
            height={50}
            src={!image ? PhotoImg : image}
            alt=""
          />
          <p>{fileName}</p>
        </div>
      </div>
      <div className={styles.rightContainer}>
        <div className={styles.inputContainer}>
          <label className={styles.label} htmlFor="">
            Name of the company <span className={styles.span}>*</span>
          </label>
          <input
            className={styles.inputText}
            placeholder="Company LLC"
            type="text"
            onChange={(e) => setCompanyName(e.target.value)}
          />
        </div>

        <div className={styles.inputContainer}>
          <label className={styles.label} htmlFor="description">
            Description <span className={styles.span}>*</span>
          </label>
          <textarea
            className={styles.inputText}
            placeholder="Enter your Overview"
            name="description"
            id="description"
            rows="6"
          ></textarea>
        </div>

        <div className={styles.doubleInputsContainer}>
          <div
            className={`${styles.inputContainer} ${styles.inputContainer50}`}
          >
            <label className={styles.label} htmlFor="">
              Creation date (year) <span className={styles.span}>*</span>
            </label>
            <input
              className={styles.inputText}
              placeholder="Enter registration code"
              type="text"
            />
          </div>

          <div
            className={`${styles.inputContainer} ${styles.inputContainer50}`}
          >
            <label className={styles.label} htmlFor="">
              Turnover (last year) <span className={styles.span}>*</span>
            </label>
            <input
              className={styles.inputText}
              placeholder="Enter Price"
              type="text"
            />
          </div>
        </div>

        <div className={styles.doubleInputsContainer}>
          <div
            className={`${styles.inputContainer} ${styles.inputContainer50}`}
          >
            <label className={styles.label} htmlFor="">
              Number of employees <span className={styles.span}>*</span>
            </label>
            <input
              className={styles.inputText}
              placeholder="Enter registration code"
              type="text"
            />
          </div>

          <div
            className={`${styles.inputContainer} ${styles.inputContainer50}`}
          >
            <label className={styles.label} htmlFor="">
              Headquarters location <span className={styles.span}>*</span>
            </label>
            <input
              className={styles.inputText}
              placeholder="Enter Price"
              type="text"
            />
          </div>
        </div>

        <div className={styles.inputContainer}>
          <label className={styles.label} htmlFor="">
            Active in <span className={styles.span}>*</span>
          </label>
          <Form.Select
            bsPrefix={`form-select ${styles.inputText} ${styles.inputSelect}`}
          >
            <option>Select type of media</option>
            <option value="1">Europe</option>
            <option value="2">North America</option>
            <option value="3">South America</option>
            <option value="4">Eurasia</option>
            <option value="5">Asia</option>
            <option value="6">Oceania</option>
            <option value="7">Caribbean</option>
            <option value="8">Australia</option>
            <option value="9">Africa</option>
            <option value="10">Middle East</option>
            <option value="11">Central America</option>
          </Form.Select>
        </div>

        <div className={styles.inputContainer}>
          <label className={styles.label} htmlFor="">
            Company website: <span className={styles.span}>*</span>
          </label>
          <input className={styles.inputText} placeholder="URL" type="text" />
        </div>

        <div className={styles.doubleInputsContainer}>
          <div
            className={`${styles.inputContainer} ${styles.inputContainer50}`}
          >
            <label className={styles.label} htmlFor="">
              Name of Product
            </label>
            <input
              className={styles.inputText}
              placeholder="Enter registration code"
              type="text"
            />
          </div>

          <div
            className={`${styles.inputContainer} ${styles.inputContainer50}`}
          >
            <label className={styles.label} htmlFor="">
              Version Number
            </label>
            <input
              className={styles.inputText}
              placeholder="Enter Price"
              type="text"
            />
          </div>
        </div>
        <div className={styles.line}></div>
        <div>
          <div>
            <p className={styles.label}>
              Categories <span className={styles.span}>*</span>
            </p>
          </div>
          <div className={styles.categoriesContainer}>
            {categories?.map((category, index) => (
              <div className={styles.inputCheckboxContainer} key={index}>
                <Checkbox></Checkbox>
                <label className={styles.labelCheckbox} for={category.name}>
                  {category.name}
                </label>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div>
            <p className={styles.label}>
              Sub-Categories <span className={styles.span}>*</span>
            </p>
          </div>
          <div className={styles.categoriesContainer}>
            {subCategories?.map((subCategory, index) => (
              <div className={styles.inputCheckboxContainer} key={index}>
                <Checkbox></Checkbox>
                <label className={styles.labelCheckbox} for={subCategory.name}>
                  {subCategory.name}
                </label>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.line}></div>
        <div className={styles.inputContainer}>
          <label className={styles.label} htmlFor="">
            Do you have any specific cooperation agreement with other IT vendors
            for pitching?
          </label>
          <input className={styles.inputText} type="text" />
        </div>

        <div className={styles.inputContainer}>
          <label className={styles.label} htmlFor="">
            Bank connectivity (through which types of channel - please specify)
            :
          </label>
          <input className={styles.inputText} type="text" />
        </div>

        <div className={styles.inputContainer}>
          <label className={styles.label} htmlFor="">
            Do you have any other specific functionalities:
          </label>
          <input className={styles.inputText} type="text" />
        </div>

        <div className={styles.inputContainer}>
          <label className={styles.label} htmlFor="">
            Do you have specific integration with Fintechs? (If YES please
            specify which ones):
          </label>
          <input className={styles.inputText} type="text" />
        </div>

        <div className={styles.inputContainer}>
          <label className={styles.label} htmlFor="">
            Do you propose solutions or functionalities based on AI? (if YES
            please specify):
          </label>
          <input className={styles.inputText} type="text" />
        </div>

        <div className={styles.buttonContainer}>
          <button onClick={() => submit()} className={styles.button}>
            Save information
          </button>
        </div>
      </div>
    </div>
  );
};

export default BodyForm;

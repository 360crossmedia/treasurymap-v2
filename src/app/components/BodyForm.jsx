"use client";
import Image from "next/image";
import styles from "../styles/BodyForm.module.css";
import PhotoImg from "../assets/photoImg.svg";
import { Checkbox } from "primereact/checkbox";
import { useEffect, useState } from "react";
import { apiCreateCompany } from "../service/apiCreateCompany";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { apiGetCategories } from "../service/apiGetCategories";
import { apiGetSubCategories } from "../service/apiGetSubCategories";
import { apiUploadImage } from "../service/apiUploadImage";
import { setIsLoading } from "../store/slices/isLoading.slice";
import { useDispatch } from "react-redux";
import { apiGetAllQuestions } from "../service/apiGetAllQuestions";
import { apiUploadAnswers } from "../service/apiUploadAnswers";
import { apiGetAllCountries } from "../service/apiGetAllCountries";
import MultiSelect from "./MultiSelect";
import { apiGetCompanyData } from "../service/apiGetCompanyData";
import { apiGetCompanyAnswers } from "../service/apiGetCompanyAnswers";

const BodyForm = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [image, setImage] = useState();
  const [fileName, setFileName] = useState("Upload logo");
  const [file, setFile] = useState();
  const [companyName, setCompanyName] = useState("");
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [countries, setCountries] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState([]);
  const [selectedSubCategoryIds, setSelectedSubCategoryIds] = useState([]);
  const [selectedCountriesIds, setSelectedCountriesIds] = useState([]);
  const [companyDescription, setCompanyDescription] = useState("");
  const [creationDate, setCreationDate] = useState("");
  const [companyWebsite, setCompanyWebsite] = useState("");
  const [turnover, setTurnover] = useState("");
  const [employees, setEmployees] = useState("");
  const [location, setLocation] = useState("");
  const [productName, setProductName] = useState("");
  const [productVersion, setProductVersion] = useState("");
  const userId = useSelector((state) => state.user);
  const companyId = useSelector((state) => state.companyId);

  const submit = async () => {
    dispatch(setIsLoading(true));
    const logo = await uploadImage();
    const result = await apiCreateCompany({
      name: companyName,
      companyCategories: selectedCategoryIds,
      companySubcategories: selectedSubCategoryIds,
      description: companyDescription,
      companyOffices: selectedCountriesIds,
      userId,
      logo,
      creationDate,
      turnover,
      employees,
      location,
      companyWebsite,
      productName,
      productVersion,
    });
    if (result?.status == 201 && logo) {
      const answersResult = await apiUploadAnswers(result?.data?.id, answers);
      if (answersResult?.status == 201) {
        alert("Company created successfully");
        router.push("/dashboard");
        dispatch(setIsLoading(false));
      } else {
        console.log(answersResult);
        dispatch(setIsLoading(false));
      }
    } else {
      console.log(result);
      dispatch(setIsLoading(false));
    }
  };

  const handleAnswerChange = (index, value) => {
    const updatedAnswers = [...answers];
    updatedAnswers[index] = value;
    setAnswers(updatedAnswers);
  };

  const uploadImage = async () => {
    const formData = new FormData();
    formData.append("file", file);
    const result = await apiUploadImage(formData);
    return result;
  };

  const getAllComponentData = async () => {
    const categories = await apiGetCategories();
    const subCategories = await apiGetSubCategories();
    const questions = await apiGetAllQuestions();
    const countries = await apiGetAllCountries();
    setCategories(categories?.data);
    setSubCategories(subCategories?.data);
    setQuestions(questions?.data);
    setCountries(countries?.data);
  };

  const getAllInputsData = async () => {
    const companyData = await apiGetCompanyData(companyId);
    const companyAnswers = await apiGetCompanyAnswers(companyId);
    setCompanyName(companyData?.name);
    setCompanyDescription(companyData?.description);
    setCreationDate(companyData?.creationDate);
    setTurnover(companyData?.turnover);
    setEmployees(companyData?.employees);
    setLocation(companyData?.location);
    setSelectedCountriesIds(companyData?.companyOffices);
    setCompanyWebsite(companyData?.companyWebsite);
    setProductName(companyData?.productName);
    setProductVersion(companyData?.productVersion);
    setSelectedCategoryIds(companyData?.companyCategories);
    setSelectedSubCategoryIds(companyData?.companySubcategories);
    setImage(companyData?.logo);
    setAnswers(companyAnswers);
    console.log(companyAnswers);
  };

  useEffect(() => {
    getAllComponentData();
    if (companyId) getAllInputsData();
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
                setFile(file);
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
            value={companyName}
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
            value={companyDescription}
            onChange={(e) => setCompanyDescription(e.target.value)}
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
              placeholder="2024"
              type="text"
              value={creationDate}
              onChange={(e) => setCreationDate(e.target.value)}
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
              placeholder="Enter Amount"
              type="text"
              value={turnover}
              onChange={(e) => setTurnover(e.target.value)}
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
              placeholder="Enter a number of employees"
              type="text"
              value={employees}
              onChange={(e) => setEmployees(e.target.value)}
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
              placeholder="USA"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
        </div>
        <div className={styles.inputContainer}>
          <label className={styles.label} htmlFor="">
            Active in <span className={styles.span}>*</span>
          </label>
          <MultiSelect
            options={countries}
            value={selectedCountriesIds}
            set={setSelectedCountriesIds}
          />
        </div>
        <div className={styles.inputContainer}>
          <label className={styles.label} htmlFor="">
            Company website: <span className={styles.span}>*</span>
          </label>
          <input
            className={styles.inputText}
            placeholder="URL"
            type="text"
            value={companyWebsite}
            onChange={(e) => setCompanyWebsite(e.target.value)}
          />
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
              placeholder="Software"
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
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
              placeholder="2.0.5"
              type="text"
              value={productVersion}
              onChange={(e) => setProductVersion(e.target.value)}
            />
          </div>
        </div>
        <div>
          <div>
            <p className={styles.label}>
              Categories <span className={styles.span}>*</span>
            </p>
          </div>
          <div className={styles.categoriesContainer}>
            {categories?.map((category, index) => (
              <div className={styles.inputCheckboxContainer} key={index}>
                <Checkbox
                  onChange={(e) => {
                    if (e.checked) {
                      setSelectedCategoryIds((prevIds) => [
                        ...prevIds,
                        category.id,
                      ]);
                    } else {
                      setSelectedCategoryIds((prevIds) =>
                        prevIds.filter((id) => id !== category.id)
                      );
                    }
                  }}
                  checked={selectedCategoryIds.includes(category.id)}
                ></Checkbox>
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
                <Checkbox
                  onChange={(e) => {
                    if (e.checked) {
                      setSelectedSubCategoryIds((prevIds) => [
                        ...prevIds,
                        subCategory.id,
                      ]);
                    } else {
                      setSelectedSubCategoryIds((prevIds) =>
                        prevIds.filter((id) => id !== subCategory.id)
                      );
                    }
                  }}
                  checked={selectedSubCategoryIds.includes(subCategory.id)}
                ></Checkbox>
                <label className={styles.labelCheckbox} for={subCategory.name}>
                  {subCategory.name}
                </label>
              </div>
            ))}
          </div>
        </div>
        {questions?.map((question, index) => (
          <div className={styles.inputContainer} key={index}>
            <label className={styles.label} htmlFor="">
              {question.body}
            </label>
            <input
              className={styles.inputText}
              type="text"
              value={answers[index] || ""}
              onChange={(e) => handleAnswerChange(index, e.target.value)}
            />
          </div>
        ))}
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

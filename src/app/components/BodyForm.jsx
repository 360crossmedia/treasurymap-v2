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
import { setIsLoading } from "../store/slices/isLoading.slice";
import { useDispatch } from "react-redux";
import { apiGetAllQuestions } from "../service/apiGetAllQuestions";
import { apiUploadAnswers } from "../service/apiUploadAnswers";
import { apiGetAllCountries } from "../service/apiGetAllCountries";
import MultiSelect from "./MultiSelect";
import { apiGetCompanyData } from "../service/apiGetCompanyData";
import { apiGetCompanyAnswers } from "../service/apiGetCompanyAnswers";
import { apiUpdateCompany } from "../service/apiUpdateCompany";
import { setCompanyId } from "../store/slices/companyToUpdate.slice";
import Form from "react-bootstrap/Form";
import { apiGetAllUsers } from "../service/apiGetAllUsers";
import { apiDeleteAllAnswersByCompanyId } from "../service/apiDeleteAllAnswersByCompanyId";
import { apiSendUpdateEmail } from "../service/apiSendUpdateEmail";
import { apiSendCreateEmail } from "../service/apiSendCreateEmail";
import { uploadImage } from "../utils";
import { RadioButton } from "primereact/radiobutton";
import { apiUploadSubOptions } from "../service/apiUploadSubOptions";
import { apiGetSubOptionsByCompany } from "../service/apiGetSubOptionsByCompany";

const BodyForm = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [image, setImage] = useState("");
  const [fileName, setFileName] = useState("Upload logo");
  const [file, setFile] = useState();
  const [companyName, setCompanyName] = useState("");
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [countries, setCountries] = useState([
    { id: "Cargando", name: "Cargando..." },
  ]);
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
  const [keywords, setKeywords] = useState([]);
  const [users, setUsers] = useState();
  const [userSelected, setUserSelected] = useState(1);
  const [backUpUserId, setBackUpUserId] = useState();
  const [isLive, setIsLive] = useState(false);
  const [selectMainCategory, setSelectMainCategory] = useState();
  const [showTurnover, setShowTurnover] = useState(true);
  const [isMultiplayerMap, setIsMultiplayerMap] = useState(false);
  const [selectedSubOptions, setSelectedSubOptions] = useState({});
  const userId = useSelector((state) => state.user);
  const companyId = useSelector((state) => state.companyId);
  let user;
  let backUpCompanyId;
  if (typeof window !== "undefined") {
    user = localStorage.getItem("userId");
    backUpCompanyId = localStorage.getItem("companyId");
  }

  const submit = async (e) => {
    dispatch(setIsLoading(true));
    e.preventDefault();
    if (
      selectedCategoryIds?.length > 0 &&
      selectedCountriesIds?.length > 0 &&
      selectedSubCategoryIds?.length > 0 &&
      selectMainCategory
    ) {
      const logoCloudinary = image?.includes("https://")
        ? ""
        : await uploadImage(file);
      const logo = image?.includes("https://") ? image : logoCloudinary;
      const users = await apiGetAllUsers();

      const data = {
        name: companyName,
        companyCategories: selectedCategoryIds,
        companySubcategories: selectedSubCategoryIds,
        description: companyDescription,
        companyOffices: selectedCountriesIds,
        userId: !userId ? backUpUserId : userId,
        live: isLive,
        multiplayerMap: isMultiplayerMap,
        showTurnover,
        logo,
        creationDate,
        turnover,
        employees,
        location,
        companyWebsite,
        productName,
        productVersion,
        keywords: [companyName, ...(keywords || [])],
        maincategory: [selectMainCategory],
      };

      if (companyId || backUpCompanyId) {
        if (userSelected) data.userId = userSelected;
        const result = await apiUpdateCompany(
          !companyId ? backUpCompanyId : companyId,
          data
        );
        if (result?.status == 200) {
          const answersResult = await apiDeleteAllAnswersByCompanyId(
            companyId ? companyId : backUpCompanyId
          );
          if (answersResult?.status == 200) {
            const answersCreate = await apiUploadAnswers(
              companyId ? companyId : backUpCompanyId,
              answers
            );
            if (answersCreate?.status == 201) {
              const uploadSubOptions = await apiUploadSubOptions(
                companyId ? companyId : backUpCompanyId,
                selectedSubOptions
              );
              if (uploadSubOptions?.status == 200) {
                const sendEmail = await apiSendUpdateEmail({
                  companyName,
                  name: users[!userId ? backUpUserId - 1 : userId - 1]
                    ?.fullName,
                  previousValue: result.data,
                  newValue: JSON.parse(result.config.data),
                });
                if (sendEmail?.status == 200) {
                  alert("Company updated successfully");
                  dispatch(setCompanyId(false));
                  dispatch(setIsLoading(false));
                  router.push("/dashboard");
                } else {
                  console.log(sendEmail);
                  dispatch(setIsLoading(false));
                }
              }
            }
          }
        } else {
          alert("Something went wrong. Please check information.");
          console.log(result);
          dispatch(setIsLoading(false));
        }
      } else {
        if (userId == 1 || user == 1) {
          if (userSelected) {
            data.userId = userSelected;
            const result = await apiCreateCompany(data);
            if (result?.status == 201 && logo) {
              const answersResult = await apiUploadAnswers(
                result?.data?.id,
                answers
              );
              if (answersResult?.status == 201) {
                const sendCreateEmail = await apiSendCreateEmail({
                  companyName,
                  name: users[!userId ? backUpUserId - 1 : userId - 1]
                    ?.fullName,
                });
                if (sendCreateEmail.status == 200) {
                  alert("Company created successfully");
                  router.push("/dashboard");
                  dispatch(setIsLoading(false));
                } else {
                  console.log(sendCreateEmail);
                  dispatch(setIsLoading(false));
                }
              } else {
                console.log(answersResult);
                dispatch(setIsLoading(false));
              }
            }
          } else {
            dispatch(setIsLoading(false));
            alert("Check missing required fields");
          }
        } else {
          const result = await apiCreateCompany(data);
          if (result?.status == 201 && logo) {
            const answersResult = await apiUploadAnswers(
              result?.data?.id,
              answers
            );
            if (answersResult?.status == 201) {
              const sendCreateEmail = await apiSendCreateEmail({
                companyName,
                name: users[!userId ? backUpUserId - 1 : userId - 1]?.fullName,
              });
              if (sendCreateEmail.status == 200) {
                alert("Company created successfully");
                router.push("/dashboard");
                dispatch(setIsLoading(false));
              } else {
                console.log(sendCreateEmail);
                dispatch(setIsLoading(false));
              }
            } else {
              console.log(answersResult);
              dispatch(setIsLoading(false));
            }
          } else {
            alert("Something went wrong. Please check information.");
            console.log(result);
            dispatch(setIsLoading(false));
          }
        }
      }
    } else {
      dispatch(setIsLoading(false));
      alert("Check missing required fields");
    }
  };

  const handleAnswerChange = (index, value) => {
    const updatedAnswers = [...answers];
    updatedAnswers[index] = value;
    setAnswers(updatedAnswers);
  };

  const getAllComponentData = async () => {
    dispatch(setIsLoading(true));
    const categories = await apiGetCategories();
    const subCategories = await apiGetSubCategories();
    const questions = await apiGetAllQuestions();
    const countries = await apiGetAllCountries();
    setCategories(categories?.data);
    setSubCategories(subCategories?.data);
    setQuestions(questions?.data);
    setCountries(countries?.data);
    dispatch(setIsLoading(false));
  };

  const getAllInputsData = async () => {
    dispatch(setIsLoading(true));
    const companyData = await apiGetCompanyData(
      !companyId ? backUpCompanyId : companyId
    );
    const companyAnswers = await apiGetCompanyAnswers(
      !companyId ? backUpCompanyId : companyId
    );
    const categoriesSubOptions = await apiGetSubOptionsByCompany(
      !companyId ? backUpCompanyId : companyId
    );
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
    setIsLive(companyData?.live);
    setUserSelected(companyData?.userId);
    setShowTurnover(companyData?.showTurnover);
    setIsMultiplayerMap(companyData?.multiplayerMap);
    let inputKeywords = companyData?.keywords;
    let toSetKeyword = inputKeywords?.filter(
      (item) => item !== companyData?.name
    );
    setKeywords(toSetKeyword);
    setSelectMainCategory(...companyData?.maincategory);
    parseCategoriesSubOptions(categoriesSubOptions);
    dispatch(setIsLoading(false));
  };

  const convertKeywords = (keywords) => {
    let keyArray = keywords.split(",");
    setKeywords(keyArray);
  };

  const getAllUsers = async () => {
    dispatch(setIsLoading(true));
    const result = await apiGetAllUsers();
    setUsers(result);
    dispatch(setIsLoading(false));
  };

  const handleUpdateMainCategory = (categoryId) => {
    let previus;
    setSelectMainCategory((prev) => {
      previus = prev;
      return categoryId;
    });
    setTimeout(() => {
      setSelectedCategoryIds((prevIds) => {
        const updatedIds = prevIds.filter((id) => id !== previus);
        return [...updatedIds, categoryId];
      });
    }, 50);
  };

  const parseCategoriesSubOptions = (categoriesSubOptions) => {
    const selectedSubOptions = categoriesSubOptions.reduce((acc, item) => {
      acc[item.categoryId] = item.subOptionId;
      return acc;
    }, {});

    setSelectedSubOptions(selectedSubOptions);
  };

  useEffect(() => {
    getAllComponentData();
    if (!companyId ? backUpCompanyId : companyId) getAllInputsData();
    if (userId == 1 || user == 1) getAllUsers();
  }, []);

  useEffect(() => setBackUpUserId(user), [user]);

  return (
    <form onSubmit={submit} className={styles.mainContainer}>
      <div className={styles.uploadPhotoContainer}>
        <div className={styles.card}>
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
          <Image
            src={!image ? PhotoImg : image}
            alt=""
            width={0}
            height={0}
            sizes="100vw"
            style={{ width: "80%", height: "auto", maxHeight: "95%" }}
          />
          <p>
            {fileName}{" "}
            {fileName == "Upload logo" && (
              <span className={styles.span}>*</span>
            )}
          </p>
          <ul style={{ fontSize: "10px" }}>
            <li>Format: PNG</li>
            <li>Background: Transparent</li>
            <li>Minimum Dimensions: 200px width</li>
            <li>Maximum File Size: 500KB</li>
            <li>
              Quality: Logos should be clear, without pixelation or distortion
            </li>
          </ul>
        </div>
      </div>
      <div className={styles.rightContainer}>
        {(userId == 1 || backUpUserId == 1) && (
          <div className={styles.inputContainer}>
            <label className={styles.label} htmlFor="">
              Live on the Map:
            </label>
            <Form.Check
              type="switch"
              id="custom-switch"
              label={isLive ? "On" : "Off"}
              onChange={(e) => setIsLive(e.target.checked)}
              checked={isLive}
            />
          </div>
        )}
        {(userId == 1 || backUpUserId == 1) && (
          <div className={styles.inputContainer}>
            <label className={styles.label} htmlFor="">
              Live on the Multiplayer Map:
            </label>
            <Form.Check
              type="switch"
              id="custom-switch"
              label={isMultiplayerMap ? "On" : "Off"}
              onChange={(e) => setIsMultiplayerMap(e.target.checked)}
              checked={isMultiplayerMap}
            />
          </div>
        )}
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
            required
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
            value={companyDescription ?? ""}
            onChange={(e) => setCompanyDescription(e.target.value)}
            required
            maxLength={6000}
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
              className={`${styles.inputText} `}
              placeholder="Enter creation year"
              type="text"
              value={creationDate}
              onChange={(e) =>
                setCreationDate(e.target.value.replace(/[^0-9]/g, ""))
              }
              required
            />
          </div>
          <div
            className={`${styles.inputContainer} ${styles.inputContainer50}`}
          >
            <label className={styles.label} htmlFor="">
              Turnover (last year) <span className={styles.span}>*</span>
              <Form.Check
                type="switch"
                id="custom-switch2"
                label={showTurnover ? "Show" : "Not Show"}
                onChange={(e) => setShowTurnover(e.target.checked)}
                checked={showTurnover}
                className={styles.showTurnoverSwitch}
              />
            </label>
            <input
              className={styles.inputText}
              placeholder="Enter Amount"
              type="text"
              value={turnover}
              onChange={(e) =>
                setTurnover(e.target.value.replace(/[^0-9]/g, ""))
              }
              required
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
              onChange={(e) =>
                setEmployees(e.target.value.replace(/[^0-9]/g, ""))
              }
              required
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
              required
            />
          </div>
        </div>
        <div className={styles.inputContainer}>
          <label className={styles.label} htmlFor="">
            Active in (Choose as many as apply){" "}
            <span className={styles.span}>*</span>
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
            required
          />
        </div>
        <div className={styles.inputContainer}>
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
        <div className={styles.inputContainer}>
          <label className={styles.label} htmlFor="">
            Product Description
          </label>
          <textarea
            className={styles.inputText}
            placeholder="Product Description"
            type="text"
            value={productVersion}
            onChange={(e) => setProductVersion(e.target.value)}
            rows={4}
            maxLength={6000}
          ></textarea>
        </div>

        <div className={styles.inputContainer}>
          <label className={styles.label} htmlFor="">
            Category to display on the map (Main category){" "}
            <span className={styles.span}>*</span>
          </label>

          <Form.Select
            value={selectMainCategory}
            className={styles.inputText}
            onChange={(e) => handleUpdateMainCategory(Number(e.target.value))}
          >
            {!selectMainCategory && <option>Select main category</option>}
            {categories?.map((cat, index) => (
              <option key={index} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </Form.Select>
        </div>

        <div>
          <div>
            <p className={styles.label}>
              Categories (Choose as many as apply){" "}
              <span className={styles.span}>*</span>
            </p>
          </div>
          <div className={styles.categoriesContainer}>
            <div className={styles.column}>
              {categories
                .slice(0, Math.ceil(categories.length / 2))
                .map((category, index) => (
                  <div key={index} className={styles.categoryColumn}>
                    <div className={styles.inputCheckboxContainer} key={index}>
                      <Checkbox
                        disabled={category.id == selectMainCategory}
                        onChange={(e) => {
                          if (e.checked) {
                            setSelectedCategoryIds((prevIds) => [
                              ...(prevIds || []),
                              category.id,
                            ]);
                          } else {
                            setSelectedCategoryIds((prevIds) =>
                              prevIds.filter((id) => id !== category.id)
                            );

                            setSelectedSubOptions((prevState) => {
                              const newState = { ...prevState };
                              delete newState[category.id]; // Elimina la selección de esa categoría
                              return newState;
                            });
                          }
                        }}
                        checked={
                          selectedCategoryIds?.includes(category.id) ||
                          category.id === selectMainCategory
                        }
                      ></Checkbox>
                      <label
                        className={styles.labelCheckbox}
                        htmlFor={category.name}
                      >
                        {category.name}
                      </label>
                    </div>
                    {selectedCategoryIds.includes(category.id) &&
                      category.sub_options.length > 0 && (
                        <div className={styles.inputRadioContainer}>
                          <p className={styles.labelCheckbox}>
                            How do you proceed?{" "}
                            <span className={styles.span}>*</span>
                          </p>
                          {category.sub_options.map((subOption) => (
                            <div
                              key={subOption.id}
                              className={styles.radioButtonsContainer}
                            >
                              <RadioButton
                                inputId={`${category.id}-${subOption.id}`} // Un identificador único para cada radio button
                                name={`subOption-${category.id}`} // Agrupa por categoría
                                value={subOption.id} // Almacena solo el id de la sub-opción
                                onChange={(e) =>
                                  setSelectedSubOptions((prevState) => ({
                                    ...prevState,
                                    [category.id]: e.value, // Almacena el id de la sub-opción seleccionada para esta categoría
                                  }))
                                }
                                checked={
                                  selectedSubOptions[category.id] ===
                                  subOption.id
                                }
                              />
                              <label
                                htmlFor={`${category.id}-${subOption.id}`}
                                className={styles.labelCheckbox}
                              >
                                {subOption.name}
                              </label>
                            </div>
                          ))}
                        </div>
                      )}
                  </div>
                ))}
            </div>
            <div className={styles.column}>
              {categories
                .slice(Math.ceil(categories.length / 2))
                .map((category, index) => (
                  <div key={index} className={styles.categoryColumn}>
                    <div className={styles.inputCheckboxContainer} key={index}>
                      <Checkbox
                        disabled={category.id == selectMainCategory}
                        onChange={(e) => {
                          if (e.checked) {
                            setSelectedCategoryIds((prevIds) => [
                              ...(prevIds || []),
                              category.id,
                            ]);
                          } else {
                            setSelectedCategoryIds((prevIds) =>
                              prevIds.filter((id) => id !== category.id)
                            );

                            setSelectedSubOptions((prevState) => {
                              const newState = { ...prevState };
                              delete newState[category.id]; // Elimina la selección de esa categoría
                              return newState;
                            });
                          }
                        }}
                        checked={
                          selectedCategoryIds?.includes(category.id) ||
                          category.id === selectMainCategory
                        }
                      ></Checkbox>
                      <label
                        className={styles.labelCheckbox}
                        htmlFor={category.name}
                      >
                        {category.name}
                      </label>
                    </div>
                    {selectedCategoryIds.includes(category.id) &&
                      category.sub_options.length > 0 && (
                        <div className={styles.inputRadioContainer}>
                          <p className={styles.labelCheckbox}>
                            How do you proceed?{" "}
                            <span className={styles.span}>*</span>
                          </p>
                          {category.sub_options.map((subOption) => (
                            <div
                              key={subOption.id}
                              className={styles.radioButtonsContainer}
                            >
                              <RadioButton
                                inputId={`${category.id}-${subOption.id}`} // Un identificador único para cada radio button
                                name={`subOption-${category.id}`} // Agrupa por categoría
                                value={subOption.id} // Almacena solo el id de la sub-opción
                                onChange={(e) =>
                                  setSelectedSubOptions((prevState) => ({
                                    ...prevState,
                                    [category.id]: e.value, // Almacena el id de la sub-opción seleccionada para esta categoría
                                  }))
                                }
                                checked={
                                  selectedSubOptions[category.id] ===
                                  subOption.id
                                }
                              />
                              <label
                                htmlFor={`${category.id}-${subOption.id}`}
                                className={styles.labelCheckbox}
                              >
                                {subOption.name}
                              </label>
                            </div>
                          ))}
                        </div>
                      )}
                  </div>
                ))}
            </div>
          </div>
        </div>
        <div>
          <div>
            <p className={styles.label}>
              Sub-Categories <span className={styles.span}>*</span>
            </p>
          </div>
          <div className={styles.subCategoriesContainer}>
            {subCategories?.map((subCategory, index) => (
              <div className={styles.inputCheckboxContainer} key={index}>
                <Checkbox
                  onChange={(e) => {
                    if (e.checked) {
                      setSelectedSubCategoryIds((prevIds) => [
                        ...(prevIds || []),
                        subCategory.id,
                      ]);
                    } else {
                      setSelectedSubCategoryIds((prevIds) =>
                        prevIds.filter((id) => id !== subCategory.id)
                      );
                    }
                  }}
                  checked={selectedSubCategoryIds?.includes(subCategory.id)}
                ></Checkbox>
                <label
                  className={styles.labelCheckbox}
                  htmlFor={subCategory.name}
                >
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
            <textarea
              className={styles.inputText}
              type="text"
              value={answers[index] || ""}
              onChange={(e) => handleAnswerChange(index, e.target.value)}
              maxLength={1000}
              rows="2"
            ></textarea>
          </div>
        ))}
        <div className={styles.inputContainer}>
          <label className={styles.label} htmlFor="">
            Insert keywords related to the company (separated by commas):
          </label>
          <input
            className={styles.inputText}
            placeholder="Keyword 1, keyword 2, keyword 3"
            type="text"
            value={keywords}
            onChange={(e) => convertKeywords(e.target.value)}
          />
        </div>
        {(userId == 1 || backUpUserId == 1) && (
          <div className={styles.inputContainer}>
            <label className={styles.label} htmlFor="description">
              Company owner <span className={styles.span}>*</span>
            </label>
            <Form.Select
              value={userSelected}
              className={styles.inputText}
              onChange={(e) =>
                setUserSelected(
                  e.target.value == "Select User" ? false : e.target.value
                )
              }
              bsPrefix={`form-select ${styles.input} ${
                userSelected ? styles.active : ""
              }`}
            >
              {users?.map((user, index) => (
                <option key={index} value={user.id}>
                  {user.fullName}
                </option>
              ))}
            </Form.Select>
          </div>
        )}
        <div className={styles.buttonContainer}>
          <button
            onClick={() => router.push("/dashboard")}
            type="button"
            className={styles.cancelButton}
          >
            Cancel
          </button>
          <button className={styles.button}>Save information</button>
        </div>
      </div>
    </form>
  );
};

export default BodyForm;

"use client";
import Image from "next/image";
import styles from "../styles/BodyForm.module.css";
import PhotoImg from "../assets/photoImg.svg";
import { Checkbox } from "primereact/checkbox";
import { useEffect, useState, useRef } from "react";
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
import { apiDeleteCompanyById } from "../service/apiDeleteCompanyById";

// ── Section divider — turns the long form into clearly labelled sections ──────
const SectionHead = ({ n, title, sub, first }) => (
  <div
    style={{
      display: "flex", alignItems: "center", gap: 12,
      margin: first ? "2px 0 18px" : "36px 0 18px",
      paddingTop: first ? 0 : 20,
      borderTop: first ? "none" : "1px solid #eef2f8",
    }}
  >
    <span style={{ width: 28, height: 28, borderRadius: 8, background: "linear-gradient(135deg,#4D8DFF,#2f6fe0)", color: "#fff", display: "grid", placeItems: "center", fontSize: 13, fontWeight: 700, flexShrink: 0 }}>{n}</span>
    <div>
      <div style={{ fontSize: 16, fontWeight: 700, color: "#0e2c5c" }}>{title}</div>
      {sub && <div style={{ fontSize: 12.5, color: "#7a899f", marginTop: 1 }}>{sub}</div>}
    </div>
  </div>
);

// ── Inline help line under a label ───────────────────────────────────────────
const Hint = ({ children }) => (
  <p style={{ fontSize: 12.5, color: "#8a93a6", margin: "-2px 0 6px", lineHeight: 1.45 }}>{children}</p>
);

// ── Searchable user/owner picker (admin) ─────────────────────────────────────
const SearchableUsers = ({ users = [], value, onChange }) => {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const ref = useRef(null);
  const selected = (users || []).find((u) => String(u.id) === String(value));
  const shown = q.trim()
    ? users.filter((u) => (u.fullName || u.email || "").toLowerCase().includes(q.toLowerCase().trim()))
    : users;
  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) { setOpen(false); setQ(""); } };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  return (
    <div ref={ref} style={{ position: "relative" }}>
      <div
        onClick={() => setOpen((o) => !o)}
        style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, padding: "12px 15px", borderRadius: 12, border: "1.5px solid #e3e9f2", background: "#f7f9fc", cursor: "pointer", fontSize: 14.5, color: selected ? "#0e2c5c" : "#9aa3b5", fontWeight: selected ? 600 : 400 }}
      >
        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {selected ? (selected.fullName || selected.email) : "Select an owner"}
        </span>
        <span style={{ color: "#8a93a6" }}>▾</span>
      </div>
      {open && (
        <div style={{ position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0, zIndex: 60, background: "#fff", border: "1px solid #e1e7f1", borderRadius: 12, boxShadow: "0 16px 44px -12px rgba(10,26,51,.24)", overflow: "hidden" }}>
          <input
            autoFocus value={q} onChange={(e) => setQ(e.target.value)}
            placeholder="Search a user…"
            style={{ width: "100%", border: "none", borderBottom: "1px solid #f0f3f8", outline: "none", padding: "11px 14px", fontSize: 14, color: "#0e2c5c", boxSizing: "border-box" }}
          />
          <div style={{ maxHeight: 260, overflowY: "auto", padding: 4 }}>
            {shown.slice(0, 50).map((u) => (
              <div key={u.id}
                onClick={() => { onChange({ target: { value: u.id } }); setOpen(false); setQ(""); }}
                style={{ padding: "9px 12px", borderRadius: 8, fontSize: 13.5, color: String(u.id) === String(value) ? "#2f6fe0" : "#3a4a66", fontWeight: String(u.id) === String(value) ? 600 : 400, cursor: "pointer", background: String(u.id) === String(value) ? "#eef4ff" : "transparent" }}
                onMouseEnter={(e) => { if (String(u.id) !== String(value)) e.currentTarget.style.background = "#f4f8ff"; }}
                onMouseLeave={(e) => { if (String(u.id) !== String(value)) e.currentTarget.style.background = "transparent"; }}>
                {u.fullName || u.email}
              </div>
            ))}
            {!shown.length && <div style={{ padding: "10px 12px", color: "#9aa3b5", fontSize: 13 }}>No match</div>}
          </div>
        </div>
      )}
    </div>
  );
};

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
  const [clientPackage, setClientPackage] = useState("");
  const [selectedSubOptions, setSelectedSubOptions] = useState({});
  const userId = useSelector((state) => state.user);
  const companyId = useSelector((state) => state.companyId);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [logoError, setLogoError] = useState("");
  let user;
  let backUpCompanyId;
  if (typeof window !== "undefined") {
    user = localStorage.getItem("userId");
    backUpCompanyId = localStorage.getItem("companyId");
  }

  const isAdmin = userId == 1 || backUpUserId == 1;
  const editingId = companyId || (backUpCompanyId ? Number(backUpCompanyId) : null);

  // Logo upload: enforce PNG with a transparent background (anything else
  // looks bad on the map). Validates type, size, and actual transparency.
  const handleLogoFile = (file) => {
    if (!file) return;
    setLogoError("");
    const isPng = file.type === "image/png" || /\.png$/i.test(file.name || "");
    if (!isPng) { setLogoError("Logo must be a PNG file (a .png with a transparent background)."); return; }
    if (file.size > 1024 * 1024) { setLogoError("Logo is too large (max 1 MB). Please compress it and try again."); return; }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target.result;
      const img = new window.Image();
      img.onload = () => {
        let hasTransparency = false;
        try {
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0);
          const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
          for (let i = 3; i < data.length; i += 4) {
            if (data[i] < 245) { hasTransparency = true; break; }
          }
        } catch (_) {
          hasTransparency = true; // can't inspect → don't block
        }
        if (!hasTransparency) {
          setLogoError("This PNG has a solid background. Please upload a logo with a transparent background.");
          return;
        }
        setImage(dataUrl);
        setFile(file);
        setFileName(file.name.substring(0, 10) + (file.name.length > 10 ? "..." : ""));
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  };

  const handleDeleteCompany = async () => {
    if (!editingId) return;
    setDeleting(true);
    try {
      const res = await apiDeleteCompanyById(editingId);
      if (res?.status === 200) {
        dispatch(setCompanyId(false));
        try { localStorage.removeItem("companyId"); } catch (_) {}
        router.push("/dashboard");
        return;
      }
    } catch (_) {}
    setDeleting(false);
    setConfirmDelete(false);
    alert("Could not delete this company. Please try again.");
  };

  const submit = async (e) => {
    dispatch(setIsLoading(true));
    e.preventDefault();
    // A company name is the only field the database truly requires.
    if (isAdmin && !companyName?.trim()) {
      dispatch(setIsLoading(false));
      alert("Please enter a company name.");
      return;
    }
    // Don't save with a rejected logo still showing an error.
    if (logoError) {
      dispatch(setIsLoading(false));
      alert(`${logoError}\n\nPlease upload a valid logo (PNG, transparent background) before saving.`);
      return;
    }
    // A company needs a logo to appear on the map (map = Live + logo + category).
    // Block silently saving a Live company with no logo (it would be invisible).
    const hasLogo = !!file || (typeof image === "string" && image.includes("http"));
    if ((isLive || isMultiplayerMap) && !hasLogo) {
      dispatch(setIsLoading(false));
      alert(
        "This company is set to Live but has no logo, so it will NOT appear on the map.\n\nAdd a transparent PNG logo, or turn off “Live on the Map” to save it as a draft for now."
      );
      return;
    }
    if (
      isAdmin ||
      (selectedCategoryIds?.length > 0 &&
        selectedCountriesIds?.length > 0 &&
        selectedSubCategoryIds?.length > 0 &&
        selectMainCategory)
    ) {
      // Logo is optional for admins; only upload when a new file was picked.
      let logo = "";
      if (image?.includes("https://")) logo = image;
      else if (file) logo = await uploadImage(file);
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
        clientPackage: clientPackage || null,
        showTurnover,
        logo,
        creationDate,
        turnover: turnover === "" || turnover == null ? null : turnover,
        employees,
        location,
        companyWebsite,
        productName,
        productVersion,
        keywords: [companyName, ...(keywords || [])],
        maincategory: selectMainCategory ? [selectMainCategory] : [],
      };

      if (companyId || backUpCompanyId) {
        if (userSelected) data.userId = userSelected;
        const result = await apiUpdateCompany(
          !companyId ? backUpCompanyId : companyId,
          data
        );
        if (result?.status == 200) {
          // The company (incl. logo) is saved at this point. Answers, sub-options
          // and the notification email are best-effort and must NEVER block the
          // success confirmation/redirect.
          const cid = companyId ? companyId : backUpCompanyId;
          try {
            const answersResult = await apiDeleteAllAnswersByCompanyId(cid);
            if (answersResult?.status == 200) {
              await apiUploadAnswers(cid, answers);
              await apiUploadSubOptions(cid, selectedSubOptions);
            }
          } catch (_) {}
          try {
            await apiSendUpdateEmail({
              companyName,
              name: users[!userId ? backUpUserId - 1 : userId - 1]?.fullName,
              previousValue: result.data,
              newValue: JSON.parse(result.config.data),
            });
          } catch (_) {}
          alert("Company updated successfully");
          dispatch(setCompanyId(false));
          dispatch(setIsLoading(false));
          router.push("/dashboard");
        } else {
          alert("Something went wrong. Please check information.");
          console.log(result);
          dispatch(setIsLoading(false));
        }
      } else {
        // CREATE — success depends only on the company being created.
        // Answers + notification email are best-effort and never block the redirect.
        const isAdminCreate = userId == 1 || user == 1;
        if (isAdminCreate) {
          if (!userSelected) {
            dispatch(setIsLoading(false));
            alert("Please select a company owner.");
            return;
          }
          data.userId = userSelected;
        }
        const result = await apiCreateCompany(data);
        if (result?.status == 201) {
          const newId = result?.data?.id;
          try { if (newId) await apiUploadAnswers(newId, answers); } catch (_) {}
          try {
            await apiSendCreateEmail({
              companyName,
              name: users[!userId ? backUpUserId - 1 : userId - 1]?.fullName,
            });
          } catch (_) {}
          dispatch(setCompanyId(false));
          dispatch(setIsLoading(false));
          alert("Company created successfully");
          router.push("/dashboard");
        } else {
          dispatch(setIsLoading(false));
          alert("Something went wrong. Please check the information.");
          console.log(result);
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
    setClientPackage(companyData?.clientPackage || "");
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
    <form onSubmit={submit} noValidate={isAdmin} className={styles.mainContainer}>
      <div className={styles.uploadPhotoContainer}>
        <div className={styles.card} style={{ borderStyle: "dashed", borderColor: "#cdd9ec" }}>
          <input
            className={styles.inputFile}
            type="file"
            accept="image/png"
            {...(image || isAdmin ? {} : { required: true })}
            onChange={(e) => handleLogoFile(e.target.files[0])}
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
            {fileName == "Upload logo" && !isAdmin && (
              <span className={styles.span}>*</span>
            )}
          </p>
          <p style={{ fontSize: 11.5, color: "#7a899f", margin: "2px 0 8px", textAlign: "center" }}>
            Drag &amp; drop a file or click anywhere in this box
          </p>
          <ul style={{ fontSize: "10px" }}>
            <li>Format: PNG</li>
            <li>Background: Transparent</li>
            <li>Minimum Dimensions: 200px width</li>
            <li>Maximum File Size: 1 MB</li>
            <li>
              Quality: Logos should be clear, without pixelation or distortion
            </li>
          </ul>
          {logoError && (
            <p style={{ marginTop: 10, fontSize: 12, color: "#c0392b", fontWeight: 600, textAlign: "center", lineHeight: 1.4 }}>
              {logoError}
            </p>
          )}
        </div>
      </div>
      <div className={styles.rightContainer}>
        {isAdmin && (
          <SectionHead first n="A" title="Admin · Visibility" sub="Only you see this — controls where the company shows up and its client status." />
        )}
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
        {(userId == 1 || backUpUserId == 1) && (
          <div className={styles.inputContainer}>
            <label className={styles.label} htmlFor="">
              Client status
            </label>
            <Form.Select
              value={clientPackage || ""}
              onChange={(e) => setClientPackage(e.target.value)}
              bsPrefix={`form-select ${styles.input} ${clientPackage ? styles.active : ""}`}
            >
              <option value="">Free</option>
              <option value="paid">Paid client</option>
            </Form.Select>
          </div>
        )}
        <SectionHead n="1" title="Company details" sub="The essentials shown on your public page." first={!isAdmin} />
        <div className={styles.inputContainer}>
          <label className={styles.label} htmlFor="">
            Name of the company {!isAdmin && <span className={styles.span}>*</span>}
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
            Description {!isAdmin && <span className={styles.span}>*</span>}
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
              Creation date (year) {!isAdmin && <span className={styles.span}>*</span>}
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
              Turnover (last year) {!isAdmin && <span className={styles.span}>*</span>}
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
              Number of employees {!isAdmin && <span className={styles.span}>*</span>}
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
              Headquarters location {!isAdmin && <span className={styles.span}>*</span>}
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
            {!isAdmin && <span className={styles.span}>*</span>}
          </label>
          <MultiSelect
            options={countries}
            value={selectedCountriesIds}
            set={setSelectedCountriesIds}
          />
        </div>
        <div className={styles.inputContainer}>
          <label className={styles.label} htmlFor="">
            Company website: {!isAdmin && <span className={styles.span}>*</span>}
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

        <SectionHead n="2" title="Positioning on the map" sub="Where and how your logo appears on the Treasury Map." />
        <div style={{ background: "#f0f6ff", border: "1px solid #e0ebfb", borderRadius: 12, padding: "12px 16px", marginBottom: 18, fontSize: 12.5, color: "#2a4a78", lineHeight: 1.55 }}>
          <b>Main category</b> — where your single logo sits on the map.{" "}
          <b>Categories</b> — every area you also operate in.{" "}
          <b>Sub-categories</b> — the specific functions you cover (used by the map filters).
        </div>
        <div className={styles.inputContainer}>
          <label className={styles.label} htmlFor="">
            Category to display on the map (Main category){" "}
            {!isAdmin && <span className={styles.span}>*</span>}
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
              {!isAdmin && <span className={styles.span}>*</span>}
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
                            {!isAdmin && <span className={styles.span}>*</span>}
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
                            {!isAdmin && <span className={styles.span}>*</span>}
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
              Sub-Categories {!isAdmin && <span className={styles.span}>*</span>}
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
        {questions?.length > 0 && (
          <SectionHead n="3" title="Q&A" sub="These appear as a question-and-answer block on your public page." />
        )}
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
        <SectionHead n="4" title="Keywords" sub="Help treasurers find this company in search." />
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
              Company owner {!isAdmin && <span className={styles.span}>*</span>}
            </label>
            <SearchableUsers
              users={users || []}
              value={userSelected}
              onChange={(e) =>
                setUserSelected(e.target.value == "Select User" ? false : e.target.value)
              }
            />
          </div>
        )}
        <div className={styles.buttonContainer}>
          {isAdmin && editingId && (
            <button
              type="button"
              onClick={() => setConfirmDelete(true)}
              style={{
                marginRight: "auto", display: "inline-flex", alignItems: "center", gap: 8,
                background: "#fff", color: "#c0392b", border: "1.5px solid #f0c4c4",
                borderRadius: 10, padding: "10px 18px", fontWeight: 600, cursor: "pointer",
              }}
            >
              Delete company
            </button>
          )}
          <button
            onClick={() => router.push("/dashboard")}
            type="button"
            className={styles.cancelButton}
          >
            Cancel
          </button>
          <button className={styles.button}>Save information</button>
        </div>

        {confirmDelete && (
          <div
            onClick={() => !deleting && setConfirmDelete(false)}
            style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(10,26,51,.45)", backdropFilter: "blur(3px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{ background: "#fff", borderRadius: 16, padding: 28, maxWidth: 390, textAlign: "center", boxShadow: "0 24px 60px -12px rgba(10,26,51,.34)" }}
            >
              <h3 style={{ margin: "0 0 8px", color: "#0e2c5c", fontSize: 19 }}>
                Delete “{companyName || "this company"}”?
              </h3>
              <p style={{ margin: "0 0 22px", color: "#5a6a85", fontSize: 13.5, lineHeight: 1.55 }}>
                This permanently removes the company and any of its media from the map. This cannot be undone.
              </p>
              <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
                <button type="button" disabled={deleting} onClick={() => setConfirmDelete(false)}
                  style={{ background: "#f1f4f9", border: "none", borderRadius: 100, padding: "11px 22px", fontWeight: 600, color: "#2a3c5a", cursor: "pointer" }}>
                  Cancel
                </button>
                <button type="button" disabled={deleting} onClick={handleDeleteCompany}
                  style={{ background: "#c0392b", border: "none", borderRadius: 100, padding: "11px 22px", fontWeight: 600, color: "#fff", cursor: "pointer", opacity: deleting ? 0.7 : 1 }}>
                  {deleting ? "Deleting…" : "Delete"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </form>
  );
};

export default BodyForm;

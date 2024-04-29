import { apiUploadImage } from "../service/apiUploadImage";

// modules for custom input
export const modules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link", "image"],
    [{ align: [] }],
    [{ color: [] }],
    ["code-block"],
    ["clean"],
  ],
};

// formats for custom input
export const formats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "link",
  "image",
  "align",
  "color",
  "code-block",
];

// OPEN INSTRUCTIONS FOR VIDEO URL FOR CREATE VIDEO
export const openLinkInNewTab = () => {
  const url =
    "https://res.cloudinary.com/dq7aof6vb/image/upload/v1707343450/URL_instructions_ofmbm9.png";
  window.open(url, "_blank", "noopener,noreferrer");
};

// FUNCTION TO UPLOAD IMAGES
export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  const result = await apiUploadImage(formData);
  return result;
};

// FUNCTION TO FORMAT TURNOVER STRING WITH COMMAS, € AND ABREVIATURE
export const formatTurnover = (turnover) => {
  const numberFormat = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "EUR",
  });
  if (turnover >= 1000000000) {
    return `€${(turnover / 1000000000).toFixed(1)}b`;
  } else if (turnover >= 1000000) {
    return `€${(turnover / 1000000).toFixed(1)}m`;
  } else {
    return numberFormat.format(turnover).slice(0, -3);
  }
};

// FUNCTION TO CONVERT ANY STRING IN AN ARRAY SEPARATED BY COMMA -> IN TAGS OF BODY ARTICLE AND KEYWORDS ON FORM
export const stringToArr = (tags, set) => {
  let tagsArray = tags.split(",");
  set(tagsArray);
};

// FUNCTION TO FORMAT DATE TO SHOW DATE THAT WAS CREATE/UPDATE ARTICLE
export const formatDate = (dateString) => {
  const options = { year: "numeric", month: "long", day: "numeric" };
  const formattedDate = new Date(dateString).toLocaleDateString(
    "en-US",
    options
  );
  return formattedDate;
};

// FUNCTION TO FORMAT CATEGORY NAME TO SHOW ONLY THE NAME ON INSIGHTS NAVBAR
export const formatCategoryName = (categoryName) => {
  const openingParenIndex = categoryName.indexOf("(");
  if (openingParenIndex !== -1) {
    const closingParenIndex = categoryName.indexOf(")", openingParenIndex);
    if (closingParenIndex !== -1) {
      return categoryName.substring(0, openingParenIndex).trim();
    }
  }
  return categoryName.trim();
};

export const haveMediaContentToShow = (videosArr, articlesArr) => {
  if (videosArr?.length > 0 || articlesArr?.length > 0) {
    for (let i = 0; i < videosArr?.length; i++) {
      if (videosArr[i]?.live == true) {
        return true;
      }
      for (let i = 0; i < articlesArr?.length; i++) {
        if (articlesArr[i]?.live == true) {
          return true;
        }
      }
    }
  } else return false;
};

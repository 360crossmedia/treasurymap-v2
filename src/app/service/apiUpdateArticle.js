import axios from "axios";
import { url } from "./url";

export const apiUpdateArticle = async (articleId, data) => {
  return axios
    .put(`${url}/api/v1/articles/${articleId}`, data)
    .then((res) => res)
    .catch((error) => console.error("Error:", error));
};

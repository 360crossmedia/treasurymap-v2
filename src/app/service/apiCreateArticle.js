import axios from "axios";
import { url } from "./url";

export const apiCreateArticle = async (companyId, article) => {
  return axios
    .post(`${url}/api/v1/articles/create/${companyId}`, article)
    .then((response) => response)
    .catch((error) => console.error("Error:", error));
};

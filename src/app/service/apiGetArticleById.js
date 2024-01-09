import axios from "axios";
import { url } from "./url";

export const apiGetArticleById = async (id) => {
  return axios
    .get(`${url}/api/v1/articles/${id}`)
    .then((res) => res.data)
    .catch((error) => console.error("Error:", error));
};

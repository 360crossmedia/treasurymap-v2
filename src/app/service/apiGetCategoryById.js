import axios from "axios";
import { url } from "./url";

export const apiGetCategoryById = async (id) => {
  return axios
    .get(`${url}/api/v1/categories/${id}`)
    .then((res) => res.data)
    .catch((error) => console.error("Error:", error));
};

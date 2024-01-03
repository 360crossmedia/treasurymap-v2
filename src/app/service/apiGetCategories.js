import axios from "axios";
import { url } from "./url";

export const apiGetCategories = async () => {
  return axios
    .get(`${url}/api/v1/categories`)
    .then((response) => response)
    .catch((error) => console.error("Error:", error));
};

import axios from "axios";
import { url } from "./url";

export const apiGetSubCategoryById = async (id) => {
  return axios
    .get(`${url}/api/v1/subCategories/${id}`)
    .then((response) => response.data)
    .catch((error) => console.error("Error:", error));
};

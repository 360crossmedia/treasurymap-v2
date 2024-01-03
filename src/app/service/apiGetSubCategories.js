import axios from "axios";
import { url } from "./url";

export const apiGetSubCategories = async () => {
  return axios
    .get(`${url}/api/v1/subCategories`)
    .then((response) => response)
    .catch((error) => console.error("Error:", error));
};

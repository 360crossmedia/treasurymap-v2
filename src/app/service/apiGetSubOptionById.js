import axios from "axios";
import { url } from "./url";

export const apiGetSubOptionById = async (id) => {
  return axios
    .get(`${url}/api/v1/subOptions/${id}`)
    .then((res) => res.data)
    .catch((error) => console.error("Error:", error));
};

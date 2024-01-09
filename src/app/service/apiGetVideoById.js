import axios from "axios";
import { url } from "./url";

export const apiGetVideoById = async (id) => {
  return axios
    .get(`${url}/api/v1/videos/${id}`)
    .then((res) => res.data)
    .catch((error) => console.error("Error:", error));
};

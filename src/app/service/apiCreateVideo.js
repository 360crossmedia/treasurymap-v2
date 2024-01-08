import axios from "axios";
import { url } from "./url";

export const apiCreateVideo = async (companyId, video) => {
  return axios
    .post(`${url}/api/v1/videos/create/${companyId}`, video)
    .then((response) => response)
    .catch((error) => console.error("Error:", error));
};

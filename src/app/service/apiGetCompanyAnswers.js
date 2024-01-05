import axios from "axios";
import { url } from "./url";

export const apiGetCompanyAnswers = async (id) => {
  return axios
    .get(`${url}/api/v1/answers/${id}`)
    .then((res) => res.data)
    .catch((error) => console.error("Error:", error));
};

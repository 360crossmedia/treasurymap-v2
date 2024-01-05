import axios from "axios";
import { url } from "./url";

export const apiUploadAnswers = async (companyId, answers) => {
  return axios
    .post(`${url}/api/v1/answers/${companyId}`, answers)
    .then((response) => response)
    .catch((error) => console.error("Error:", error));
};

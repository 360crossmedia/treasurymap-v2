import axios from "axios";
import { url } from "./url";

export const apiGetAllQuestions = async () => {
  return axios
    .get(`${url}/api/v1/questions`)
    .then((res) => res)
    .catch((error) => console.error("Error:", error));
};

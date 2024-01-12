import axios from "axios";
import { url } from "./url";

export const apiDeleteAllAnswersByCompanyId = async (id) => {
  return axios
    .delete(`${url}/api/v1/answers/${id}`)
    .then((res) => res)
    .catch((error) => console.log(error));
};

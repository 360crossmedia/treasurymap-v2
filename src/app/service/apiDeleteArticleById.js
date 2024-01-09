import axios from "axios";
import { url } from "./url";

export const apiDeleteArticleById = async (id) => {
  return axios
    .delete(`${url}/api/v1/articles/${id}`)
    .then((res) => res)
    .catch((error) => console.log(error));
};

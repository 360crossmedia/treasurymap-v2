import axios from "axios";
import { url } from "./url";

export const apiDeleteVideoById = async (id) => {
  return axios
    .delete(`${url}/api/v1/videos/${id}`)
    .then((res) => res)
    .catch((error) => console.log(error));
};

import axios from "axios";
import { url } from "./url";

export const apiUploadImage = async (img) => {
  return axios
    .post(`http://localhost:8000/api/v1/images`, img, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((response) => response.data)
    .catch((error) => console.error("Error:", error));
};

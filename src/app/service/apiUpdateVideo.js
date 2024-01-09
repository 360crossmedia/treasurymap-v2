import axios from "axios";
import { url } from "./url";

export const apiUpdateVideo = async (videoId, data) => {
  return axios
    .put(`${url}/api/v1/videos/${videoId}`, data)
    .then((res) => res)
    .catch((error) => console.error("Error:", error));
};

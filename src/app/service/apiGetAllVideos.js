import axios from "axios";
import { url } from "./url";

export const apiGetAllVideos = async () => {
  try {
    const res = await axios.get(`${url}/api/v1/videos`);
    return res.data;
  } catch (error) {
    console.error("Error:", error);
    return [];
  }
};

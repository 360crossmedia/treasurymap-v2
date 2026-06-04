import axios from "axios";
import { url } from "./url";

export const apiGetAllArticles = async () => {
  try {
    const res = await axios.get(`${url}/api/v1/articles`);
    return res.data;
  } catch (error) {
    console.error("Error:", error);
    return [];
  }
};

import axios from "axios";
import { url } from "./url";

export const apiGetAllArticlesByCompanyId = async (id) => {
  try {
    const response = await axios.get(`${url}/api/v1/articles/all/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

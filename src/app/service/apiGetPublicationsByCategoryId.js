import axios from "axios";
import { url } from "./url";

export const apiGetPublicationsByCategoryId = async (id) => {
  try {
    const response = await axios.get(`${url}/api/v1/publications/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error:", error);
  }
};

import axios from "axios";
import { url } from "./url";

export const apiGetCountryById = async (id) => {
  try {
    const response = await axios.get(`${url}/api/v1/countries/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

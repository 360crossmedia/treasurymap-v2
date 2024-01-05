import axios from "axios";
import { url } from "./url";

export const apiGetAllCountries = async () => {
  try {
    const response = await axios.get(`${url}/api/v1/countries`);
    response.data.forEach((country) => {
      country.label = country.name;
    });
    return response;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

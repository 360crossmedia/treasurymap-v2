import axios from "axios";
import { url } from "./url";

export const apiGetCompanyHasMedia = async (companyId) => {
  try {
    const response = await axios.get(
      `${url}/api/v1/companies/hasMedia/${companyId}`
    );
    return response.data;
  } catch (error) {
    return error;
  }
};

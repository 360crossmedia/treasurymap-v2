import axios from "axios";
import { url } from "./url";

export const apiDeleteCompanyById = async (id) => {
  const headers = {
    "Content-Type": "application/json",
  };

  return axios
    .delete(`${url}/api/v1/companies/${id}`, { headers })
    .then((res) => res)
    .catch((error) => {
      alert(
        "This company owns media. If you want to delete it, you should first erase all videos and articles."
      );
      console.log(error);
    });
};

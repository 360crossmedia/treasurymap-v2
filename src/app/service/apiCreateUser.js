import axios from "axios";
import { url } from "./url";

// Sign up = create the user account only. The company listing is created later
// by the vendor from their dashboard ("Create my company profile"), where they
// are authenticated (company creation requires auth). Returns the register
// status (201 on success).
export const apiCreateUser = async (datos) => {
  const headers = { "Content-Type": "application/json" };
  const user = {
    fullName: datos.fullName,
    email: datos.email,
    password: datos.password,
  };

  return axios
    .post(`${url}/api/v1/auth/register`, JSON.stringify(user), { headers })
    .then((response) => response.status)
    .catch((error) => {
      console.error("Sign up error:", error?.response?.status || error?.message);
      return error?.response?.status || 0;
    });
};

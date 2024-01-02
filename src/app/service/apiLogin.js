import axios from "axios";
import { url } from "./url";

export const apiLogin = async (datos) => {
  const headers = {
    "Content-Type": "application/json",
    "Content-Security-Policy": "upgrade-insecure-requests",
  };

  let user = {
    email: datos.email,
    password: datos.password,
  };
  let userJson = JSON.stringify(user);

  const config = {
    method: "post",
    url: "http://3.85.170.44/api/v1/auth/login",
    data: {
      email: "sebas@gmail.com",
      password: "1234",
    },
    headers: headers,
  };

  return axios(config)
    .then((response) => response)
    .catch((error) => console.error("Error:", error));
};

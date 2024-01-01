import axios from "axios";
import { url } from "./url";

export const apiLogin = async (datos) => {
  // const headers = {
  //   "Content-Type": "application/json; charset=utf-8",
  //   Accept: "application/json",
  //   Authorization: "Bearer TuTokenDeAutorización", // Ajusta esto según tus necesidades
  //   User-Agent: "TuUserAgent", // Puedes dejar esto en blanco o establecerlo según tus necesidades
  //   // Agrega los headers CORS necesarios
  //   Access-Control-Allow-Origin: "*", // Ajusta según tu configuración de CORS
  //   "Access-Control-Allow-Credentials": "true", // Ajusta según tu configuración de CORS
  // };

  let user = {
    email: datos.email,
    password: datos.password,
  };
  let userJson = JSON.stringify(user);

  return axios
    .post(`${url}/api/v1/auth/login`, userJson)
    .then((res) => res)
    .catch((error) => console.log(error));
};

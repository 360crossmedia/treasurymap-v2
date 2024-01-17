import axios from "axios";
import { url } from "./url";

export const apiCreateUser = async (datos) => {
  const headers = {
    "Content-Type": "application/json",
  };

  let user = {
    fullName: datos.fullName,
    email: datos.email,
    password: datos.password,
  };
  let userJson = JSON.stringify(user);

  return axios
    .post(`${url}/api/v1/auth/register`, userJson, { headers })
    .then(async (response) => {
      let company = { name: datos.companyName, companyOffices:[],companyCategories:[],companySubcategories:[],keywords:[datos.companyName], userId: response.data.id , live:false};
      let companyJson = JSON.stringify(company);

      return axios
        .post(`${url}/api/v1/companies/create`, companyJson, { headers })
        .then((companyResponse) => {
          return companyResponse.status;
        })
        .catch((error) => console.log(error));
    })
    .catch((error) => console.log(error));
};

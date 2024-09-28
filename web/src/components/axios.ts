import axios from "axios";

const createAPI = () => {
  return axios.create({
    baseURL: "https://localhost:7277/api",
    headers: {
      "Content-Type": "application/json",
    },
  });
};

const API = createAPI();
export default API;
// API.interceptors.request.use((config) => {
//   config.headers.Authorization = `Bearer ${JSON.parse(
//     sessionStorage.getItem("auth") || "{}"
//   )}`;
//   return config;
// });
// API.interceptors.response.use(
//   function (response) {
//     return response;
//   },
//   async function (error) {
//     if (error.response.status === 401) {
//       console.log("unauthentificated");
//     }
//     return Promise.reject(error);
//   }
// );

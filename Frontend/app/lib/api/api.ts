import axios from "axios";

const baseURL = "/api/backend";
const api = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials:true,
  timeout:10000
});
export default api;
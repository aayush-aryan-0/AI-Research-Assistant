import axios from "axios";

const baseURL = "/api/backend";
const api = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials:true,
  timeout:150000
});
export default api;
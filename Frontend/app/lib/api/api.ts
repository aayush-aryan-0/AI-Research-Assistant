import axios from "axios";

const baseURL = "/api/backend";
if (!baseURL) throw new Error("NEXT_PUBLIC_API_URL is not defined");
const api = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials:true,
  timeout:10000
});
export default api;
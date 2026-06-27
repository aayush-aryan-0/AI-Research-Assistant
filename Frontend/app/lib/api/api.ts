import axios from "axios";
import axiosRetry from "axios-retry"
const baseURL = "/api/backend";
const api = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials:true,
  timeout:150000
});

axiosRetry(api, {
  retries: 3,
  retryDelay: axiosRetry.exponentialDelay,
  retryCondition: (error) => error.response?.status === 502 || error.response?.status === 503
})

export default api;
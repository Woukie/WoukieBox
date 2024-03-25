import axios from "axios";

console.log("API at " + process.env.EXPO_PUBLIC_API_URL);

const AxiosInstance = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  withCredentials: true,
});

export default AxiosInstance;

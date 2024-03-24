import axios from "axios";

console.log("API at " + process.env.EXPO_PUBLIC_API_URL);

const instance = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
});

export default instance;

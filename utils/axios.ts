// utils/api.ts
import axios from "axios";

export const API_KEY = "AIzaSyD13qOBkPGLhQu8XB8E36fKh-I1Mtrpvp8";
export const BASE_URL = "https://www.googleapis.com/youtube/v3";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  params: {
    key: API_KEY,
  },
});

export default axiosInstance;

// utils/api.ts
import axios, { AxiosRequestConfig } from "axios";
import { ApiResponse, AxiosErrorType } from "@/types";

export const API_KEY = "AIzaSyD13qOBkPGLhQu8XB8E36fKh-I1Mtrpvp8";
export const BASE_URL = "https://www.googleapis.com/youtube/v3";

// Single Axios instance with API key and baseURL
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  params: {
    key: API_KEY,
  },
});

// Generic GET request function
export const getRequest = async <T>(
  url: string,
  config?: AxiosRequestConfig
): Promise<ApiResponse<T>> => {
  try {
    const response = await axiosInstance.get<T>(url, config);
    return { data: response.data };
  } catch (err) {
    const error = err as AxiosErrorType;
    return {
      error: {
        message: `Failed to fetch data from ${url}`,
        status: error.response?.status,
        details: error.response?.data,
        name: "",
      },
    };
  }
};

// Specific API functions
export const getVideo = (endpoint: string) =>
  getRequest(endpoint); // API key already in instance

export const getChannel = (channelId: string) =>
  getRequest(`channels`, {
    params: {
      part: "snippet,brandingSettings,statistics,contentDetails",
      id: channelId,
    },
  });

export default axiosInstance;

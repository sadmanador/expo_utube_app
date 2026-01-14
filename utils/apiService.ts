import { API_KEY, BASE_URL } from "@/constants/api";
import { ApiResponse, AxiosErrorType } from "@/types";
import axios, { AxiosRequestConfig } from "axios";

// Single Axios instance with API key and baseURL
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  params: {
    key: API_KEY,
  },
});

// Generic GET request function
export const getRequest = async (
  url: string,
  config?: AxiosRequestConfig
): Promise<ApiResponse> => {
  try {
    const response = await axiosInstance.get(url, config);
    return { data: response.data };
  } catch (err) {
    const error = err as AxiosErrorType;
    return {
      error: {
        message: `Failed to fetch data from ${url}`,
        status: error.response?.status,
        details: error.response?.data as Record<string, unknown>,
        name: "",
      },
    };
  }
};

// Generic video/content fetcher
export const getVideo = (endpoint: string, _categoryId?: string) =>
  getRequest(endpoint);

export default axiosInstance;

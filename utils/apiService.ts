// utils/api.ts
import axios, { AxiosRequestConfig } from "axios";
import { ApiResponse, AxiosErrorType } from "@/types";
import { API_KEY, BASE_URL } from "@/constants/api";

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
        details: error.response?.data,
        name: "",
      },
    };
  }
};

// Specific API functions
export const getVideo = (endpoint: string, categoryId?: string) =>
  getRequest(endpoint); 

export const getChannel = (channelId: string) =>
  getRequest(`channels`, {
    params: {
      part: "snippet,brandingSettings,statistics,contentDetails",
      id: channelId,
    },
  });

export const fetchComments = async ({
  videoId,
  pageToken = "",
}: {
  videoId: string;
  pageToken?: string;
}) => {
  const url = `${BASE_URL}/commentThreads?part=snippet&videoId=${videoId}&pageToken=${pageToken}&maxResults=20&key=${API_KEY}`;

  const res = await fetch(url);
  const data = await res.json();

  if (data.error) throw new Error(data.error.message);

  return data;
};

export default axiosInstance;

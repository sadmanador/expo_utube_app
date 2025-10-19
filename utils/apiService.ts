// apiService.ts
import { AxiosRequestConfig, AxiosInstance } from "axios";
import axios from "axios";
import { ApiResponse, AxiosErrorType, VideoSearchResponse } from "@/types";
import { API_KEY, BASE_URL } from "./axios";




const createAxiosInstance = (baseURL: string): AxiosInstance => {
  return axios.create({
    baseURL,
  });
};


const getRequest = async <T>(
  url: string,
  config?: AxiosRequestConfig
): Promise<ApiResponse<T>> => {
  const axiosInst = createAxiosInstance(BASE_URL);

  try {
    const response = await axiosInst.get<T>(url, config);
    return { data: response.data };
  } catch (err) {
    const error = err as AxiosErrorType;
    const status = error.response?.status;
    const details = error.response?.data;

    return {
      error: {
        message: `Failed to fetch data from ${url}`,
        status,
        details,
        name: "",
      },
    };
  }
};


export const getVideo = async (
  endpoint: string
): Promise<ApiResponse<VideoSearchResponse>> => {
  const config: AxiosRequestConfig = {
    params: {
      key: API_KEY,
    },
  };

  return await getRequest<VideoSearchResponse>(endpoint, config);
};


export const getChannel = async (channelId: string): Promise<any> => {
  const axiosInst = createAxiosInstance(BASE_URL);

  try {
    const response = await axiosInst.get("channels", {
      params: {
        part: "snippet,brandingSettings,statistics,contentDetails",
        id: channelId,
        key: API_KEY,
      },
    });
    return response.data;
  } catch (error: any) {
    console.error(
      "Error fetching channel:",
      error.response?.data || error.message
    );
    throw error;
  }
};

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
export const getVideo = (endpoint: string) => getRequest(endpoint); // API key already in instance

export const getChannel = (channelId: string) =>
  getRequest(`channels`, {
    params: {
      part: "snippet,brandingSettings,statistics,contentDetails",
      id: channelId,
    },
  });

export interface CommentItem {
  id: string;
  snippet: {
    topLevelComment: {
      snippet: {
        authorDisplayName: string;
        authorProfileImageUrl: string;
        textOriginal: string;
        publishedAt: string;
      };
    };
  };
}

export interface CommentsResponse {
  items: CommentItem[];
  nextPageToken?: string;
}

export const fetchComments = async ({
  videoId,
  pageToken = "",
}: {
  videoId: string;
  pageToken?: string;
}) => {
  const API_KEY = "YOUR_YOUTUBE_API_KEY";
  const url = `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=${videoId}&pageToken=${pageToken}&maxResults=20&key=${API_KEY}`;

  const res = await fetch(url);
  const data = await res.json();

  if (data.error) throw new Error(data.error.message);

  return data;
};

export default axiosInstance;

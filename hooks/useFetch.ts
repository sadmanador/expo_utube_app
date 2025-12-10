// hooks/useFetch.ts
import { MostPopularParams, YouTubeResponse, YouTubeVideoItem } from "@/types";
import axiosInstance from "@/utils/apiService";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";



export const useFetch = <T>(endpoint: string, params?: Record<string, any>) => {
  return useQuery<YouTubeResponse<T>>({
    queryKey: [endpoint, params],
    queryFn: async () => {
      const response = await axiosInstance.get(endpoint, { params });
      return response.data;
    },
  });
};


export const useInfiniteVideos = (params?: MostPopularParams) => {
  return useInfiniteQuery<YouTubeResponse<YouTubeVideoItem>>({
    queryKey: ["videos", params],
    queryFn: async ({ pageParam = "" }) => {
      const response = await axiosInstance.get("videos", {
        params: { ...params, pageToken: pageParam },
      });
      return response.data;
    },
    getNextPageParam: (lastPage) => lastPage.nextPageToken ?? undefined,
    initialPageParam: "",
  });
};


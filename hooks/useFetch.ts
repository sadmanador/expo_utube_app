// hooks/useFetch.ts
import { YouTubeResponse } from "@/types";
import axiosInstance from "@/utils/apiService";
import { useQuery, useInfiniteQuery } from "@tanstack/react-query";



export const useFetch = <T>(
  endpoint: string,
  params?: Record<string, any>
) => {
  return useQuery<YouTubeResponse<T>>({
    queryKey: [endpoint, params],
    queryFn: async () => {
      const response = await axiosInstance.get(endpoint, { params });
      return response.data;
    },
  });
};

export const useInfiniteFetch = <T>(
  endpoint: string,
  params?: Record<string, any>
) => {
  return useInfiniteQuery<YouTubeResponse<T>>({
    queryKey: [endpoint, params],
    queryFn: async ({ pageParam = "" }) => {
      const response = await axiosInstance.get(endpoint, {
        params: { ...params, pageToken: pageParam },
      });
      return response.data;
    },
    getNextPageParam: (lastPage) => lastPage.nextPageToken ?? undefined,
    initialPageParam: "", // ✅ required for TS + TanStack v5
  });
};

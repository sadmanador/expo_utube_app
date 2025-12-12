import { useAsync } from "@/hooks/useAsync";
import { Comment, UseCommentsProps } from "@/types";
import { getRequest } from "@/utils/apiService";
import { useCallback } from "react";

export const useComments = ({ videoId, maxResults = 50 }: UseCommentsProps) => {
  // Wrap the fetch logic in useCallback
  const fetchComments = useCallback(async (pageToken = "") => {
    const endpoint = `commentThreads?part=snippet,replies&videoId=${videoId}&maxResults=${maxResults}&pageToken=${pageToken}`;

    const res = await getRequest(endpoint);

    if (res.error) throw new Error(res.error.message || "Failed to fetch comments");

    const items = res.data?.items || [];

    const mapped: Comment[] = items.map((item: any) => {
      const top = item.snippet.topLevelComment.snippet;
      const replies =
        item.replies?.comments?.map((r: any) => {
          const rs = r.snippet;
          return {
            id: r.id,
            authorDisplayName: rs.authorDisplayName || "Unknown",
            authorProfileImageUrl: rs.authorProfileImageUrl || "",
            textOriginal: rs.textOriginal || "",
            publishedAt: rs.publishedAt || "",
          };
        }) || [];

      return {
        id: item.id,
        authorDisplayName: top.authorDisplayName || "Unknown",
        authorProfileImageUrl: top.authorProfileImageUrl || "",
        textOriginal: top.textOriginal || "",
        publishedAt: top.publishedAt || "",
        replies,
      };
    });

    return mapped;
  }, [videoId, maxResults]);

  // Use useAsync to manage loading, error, and data
  const { loading, error, data: comments, execute: refetch } = useAsync(fetchComments, [fetchComments]);

  return { comments: comments || [], loading, error, refetch };
};

// hooks/useComments.ts
import { useEffect, useState } from "react";
import { Comment, UseCommentsProps } from "@/types";
import { getRequest } from "@/utils/apiService";

export const useComments = ({ videoId, maxResults = 50 }: UseCommentsProps) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchComments = async (pageToken: string = "") => {
    try {
      setLoading(true);

      const endpoint = `commentThreads?part=snippet,replies&videoId=${videoId}&maxResults=${maxResults}&pageToken=${pageToken}`;

      const res = await getRequest(endpoint);

      if (res.error) {
        setError(res.error.message);
        setComments([]);
        return;
      }

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

      setComments(mapped);
      setError(null);
    } catch (err: any) {
      console.error("Failed to fetch comments:", err);
      setError(err.message || "Failed to fetch comments");
      setComments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [videoId]);

  return { comments, loading, error, refetch: fetchComments };
};

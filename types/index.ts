import { AxiosRequestConfig, AxiosResponse } from "axios";
import { StyleProp, ViewStyle } from "react-native";

/* -----------------------------------------------------
 * SHARED TYPES (used across multiple interfaces)
 * ----------------------------------------------------*/

/** (SHARED) A single thumbnail format used by YouTube APIs */
export interface Thumbnail {
  url: string;
  width?: number;
  height?: number;
}

/** (SHARED) Collection of YouTube thumbnails */
export interface Thumbnails {
  default?: Thumbnail;
  medium?: Thumbnail;
  high?: Thumbnail;
}

/** (SHARED) Common snippet fields across YouTube API items */
export interface BaseSnippet {
  title: string;
  description?: string;
  publishedAt?: string;
  channelId?: string;
  channelTitle?: string;
  thumbnails?: Thumbnails;
}

/** (SHARED) Video statistics for API responses */
export interface VideoStatistics {
  viewCount?: string;
  likeCount?: string;
}

/** (SHARED) Video content details: duration or additional data */
export interface VideoContentDetails {
  duration?: string;
}

/** (SHARED) Flattened UI-specific video fields (Recommended, Short, Main) */
export interface BaseUIVideo {
  id: string;
  title: string;
  channelTitle: string;
  channelId: string;
  thumbnail?: string;
  viewCount?: number;
  publishedAt?: string;
}

/* -----------------------------------------------------
 * API Response Types
 * ----------------------------------------------------*/

export interface ApiResponse<T = any> {
  data?: {
    etag: string;
    items: T[];
    kind: string;
    nextPageToken?: string;
    pageInfo: PageInfo;
  };
  error?: {
    message: string;
    status?: number;
    details?: Record<string, unknown>;
    name?: string;
  } | null;
}

interface PageInfo {
  resultsPerPage: number;
  totalResults: number;
}

/* -----------------------------------------------------
 * Axios Error Type
 * ----------------------------------------------------*/

export interface AxiosErrorType {
  code?: string;
  config: AxiosRequestConfig;
  message: string;
  name: string;
  request?: XMLHttpRequest;
  response?: AxiosResponse;
  status?: number;
  stack?: string;
}

/* -----------------------------------------------------
 * YouTube API Types (using SHARED parts)
 * ----------------------------------------------------*/

export interface VideoCardItemProps {
  item: {
    id: string | { videoId: string };
    snippet: BaseSnippet;
    statistics?: VideoStatistics;
    contentDetails?: VideoContentDetails;
  };
}

export interface PlaylistItem {
  contentDetails: { videoId: string };
  snippet?: BaseSnippet;
}

export interface YouTubeVideoItem {
  id: string | { videoId: string };
  snippet: BaseSnippet;
  statistics?: VideoStatistics;
  contentDetails?: VideoContentDetails;
}

/* -----------------------------------------------------
 * UI Types (Flattened Video Types)
 * ----------------------------------------------------*/

export interface VideoItem extends BaseUIVideo {
  description: string;
  channelAvatar: string;
  duration?: string;
}

export interface RecommendedVideo extends BaseUIVideo {}

export interface RecommendedListProps {
  videos: RecommendedVideo[];
}

export interface ShortVideo extends BaseUIVideo {
  channelAvatar: string;
  description: string;
}

/* -----------------------------------------------------
 * Channel Type (using SHARED thumbnails + snippet)
 * ----------------------------------------------------*/

export interface ChannelItem {
  id: string;
  kind?: string;
  etag?: string;

  snippet: BaseSnippet & {
    customUrl?: string;
    country?: string;
  };

  brandingSettings?: {
    channel?: {
      title?: string;
      description?: string;
      keywords?: string;
      defaultLanguage?: string;
      country?: string;
    };
    image?: {
      bannerExternalUrl?: string;
      bannerMobileUrl?: string;
      bannerTabletUrl?: string;
      bannerTvUrl?: string;
      bannerTvHighUrl?: string;
      bannerExternalHdUrl?: string;
    };
  };

  statistics: {
    viewCount: string;
    subscriberCount?: string;
    hiddenSubscriberCount?: boolean;
    videoCount?: string;
  };

  contentDetails: {
    relatedPlaylists: {
      uploads: string;
      likes?: string;
      favorites?: string;
    };
  };
}

/* -----------------------------------------------------
 * Comments
 * ----------------------------------------------------*/

export interface UseCommentsProps {
  videoId: string;
  maxResults?: number;
}

/** Flattened Comment type */
export interface Comment {
  id: string;
  authorDisplayName: string;
  authorProfileImageUrl: string;
  textOriginal: string;
  publishedAt: string;
  replies?: Comment[];
}

export interface CommentsResponse {
  items: Comment[];
  nextPageToken?: string;
}

/* -----------------------------------------------------
 * Misc
 * ----------------------------------------------------*/

export interface SafeAreaLayoutProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export interface Props {
  videoId: string;
  userAvatar: string;
}

export interface YouTubeResponse<T> {
  items: T[];
  nextPageToken?: string;
}

export interface StatusViewProps {
  loading?: boolean;
  error?: string | null;
  style?: object;
}


export interface InitialPlayerParams  {
  controls?: boolean;
  modestbranding?: boolean;
  rel?: boolean;
  showinfo?: boolean;
  [key: string]: unknown;
};

export type YouTubeState =
  | "unstarted"
  | "ended"
  | "playing"
  | "paused"
  | "buffering"
  | "cued";
import { AxiosRequestConfig, AxiosResponse } from "axios";
import { StyleProp, ViewStyle } from "react-native";
import { DependencyList } from "react";

/* -----------------------------------------------------
 * 1. SHARED BASE TYPES
 * ----------------------------------------------------*/

export interface Thumbnail {
  url: string;
  width?: number;
  height?: number;
}

export interface Thumbnails {
  default?: Thumbnail;
  medium?: Thumbnail;
  high?: Thumbnail;
  standard?: Thumbnail;
  maxres?: Thumbnail;
}

export interface Localized {
  title: string;
  description: string;
}

export interface BaseSnippet {
  title: string;
  description?: string;
  publishedAt?: string;
  channelId?: string;
  channelTitle?: string;
  thumbnails?: Thumbnails;
}

export interface VideoStatistics {
  viewCount?: string;
  likeCount?: string;
}

export interface VideoContentDetails {
  duration?: string;
}

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
 * 2. API RESPONSE TYPES
 * ----------------------------------------------------*/

interface PageInfo {
  resultsPerPage: number;
  totalResults: number;
}

export interface ApiResponse<T = unknown> {
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

export interface YouTubeResponse<T> {
  items: T[];
  nextPageToken?: string;
}

/* -----------------------------------------------------
 * 3. AXIOS & NETWORK ERROR TYPES
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
 * 4. RAW YOUTUBE API MODELS
 * ----------------------------------------------------*/

export interface YouTubeVideoItem {
  id: string | { videoId: string };
  snippet: BaseSnippet;
  statistics?: VideoStatistics;
  contentDetails?: VideoContentDetails;
}

export interface PlaylistItemAPI {
  contentDetails: { videoId: string };
  snippet?: BaseSnippet;
}

export interface YouTubeShortVideoItem {
  kind: string;
  etag: string;
  id: string;
  snippet: BaseSnippet & {
    tags?: string[];
    categoryId?: string;
    liveBroadcastContent?: string;
    localized?: Localized;
    defaultAudioLanguage?: string;
  };
}

/** Raw YouTube API prop for VideoCard */
export interface VideoCardItemProps {
  item: YouTubeVideoItem;
}

export interface YouTubeVideoItemForSearch {
  id: { videoId: string } | string;
  snippet: {
    title: string;
    description: string;
    channelId: string;
    channelTitle: string;
    publishedAt: string;
    thumbnails: { medium: { url: string } };
  };
  statistics?: { viewCount?: string };
  contentDetails?: { duration?: string };
}

/* -----------------------------------------------------
 * 5. COMMENTS API TYPES
 * ----------------------------------------------------*/

export interface CommentSnippet {
  authorDisplayName: string;
  authorProfileImageUrl: string;
  textOriginal: string;
  publishedAt: string;
}

export interface CommentThreadItemAPI {
  id: string;
  snippet: {
    topLevelComment: { snippet: CommentSnippet };
  };
  replies?: {
    comments: Array<{ id: string; snippet: CommentSnippet }>;
  };
}

export interface UseCommentsProps {
  videoId: string;
  maxResults?: number;
}

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
 * 6. UI-FLATTENED VIDEO MODELS
 * ----------------------------------------------------*/

export interface VideoItem extends BaseUIVideo {
  description: string;
  channelAvatar: string;
  duration?: string;
}

export interface ShortVideo extends BaseUIVideo {
  channelAvatar: string;
  description: string;
}

export interface RecommendedVideo extends BaseUIVideo {}

export interface RecommendedListProps {
  videos: RecommendedVideo[];
}

/** UI-flattened prop for VideoCard */
export interface VideoCardUIItemProps {
  item: VideoItem;
}

/* Consolidated VideoCard props */
export type VideoCardProps =
  | VideoCardItemProps // raw API result
  | VideoCardUIItemProps // full UI-flattened video
  | { item: RecommendedVideo }; // minimal recommended UI item

/* -----------------------------------------------------
 * 7. CHANNEL MODEL
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
 * 8. COMPONENT PROPS
 * ----------------------------------------------------*/

export interface SafeAreaLayoutProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export interface CommentsSectionProps {
  videoId: string;
  userAvatar: string;
}

export interface StatusViewProps {
  loading?: boolean;
  error?: string | null;
  style?: object;
}

export interface ChannelAvatarButtonProps {
  channelId: string;
  uri: string;
  size?: number;
  to?: string;
}

export type YouTubeState =
  | "unstarted"
  | "ended"
  | "playing"
  | "paused"
  | "buffering"
  | "cued";

/* -----------------------------------------------------
 * 9. YOUTUBE VIDEO API PARAMS
 * ----------------------------------------------------*/

export interface MostPopularParams {
  part: string;
  chart: "mostPopular";
  maxResults?: number;
  regionCode?: string;
  pageToken?: string;
}

/* -----------------------------------------------------
 * 10. HOOK UTILITY TYPES
 * ----------------------------------------------------*/

export type AsyncDependencyList = DependencyList;

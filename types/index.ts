import { AxiosRequestConfig, AxiosResponse } from "axios";
import { StyleProp, ViewStyle } from "react-native";

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

export interface SidebarContextProps {
  sidebar: boolean;
  setSidebar: (sidebar: boolean) => void;
  category: number;
  setCategory: (category: number) => void;
  theme: string;
  setTheme: (theme: string) => void;
}

export interface VideoCardItemProps {
  item: {
    id: string | { videoId: string };
    snippet: {
      title: string;
      description?: string;
      channelId: string;
      channelTitle: string;
      publishedAt: string;
      thumbnails: {
        medium: { url: string };
        high?: { url: string };
      };
    };
    statistics?: {
      viewCount?: string;
      likeCount?: string;
    };
    contentDetails?: {
      duration?: string;
    };
  };
}


export interface ChannelSnippet {
  id: string; // Channel ID
  kind?: string; // "youtube#channel"
  etag?: string;

  snippet: {
    title: string;
    description: string;
    customUrl?: string;
    publishedAt?: string;
    thumbnails?: {
      default: { url: string; width?: number; height?: number };
      medium?: { url: string; width?: number; height?: number };
      high?: { url: string; width?: number; height?: number };
    };
    localized?: {
      title: string;
      description: string;
    };
    country?: string;
  };

  brandingSettings?: {
    channel?: {
      title?: string;
      description?: string;
      keywords?: string;
      defaultTab?: string;
      moderateComments?: boolean;
    };
    image?: {
      bannerExternalUrl?: string;
      bannerImageUrl?: string;
      bannerMobileImageUrl?: string;
    };
  };

  statistics?: {
    viewCount: string;
    subscriberCount?: string;
    hiddenSubscriberCount?: boolean;
    videoCount?: string;
  };

  contentDetails?: {
    relatedPlaylists?: {
      uploads: string;
      likes?: string;
      favorites?: string;
      watchHistory?: string;
      watchLater?: string;
    };
  };
}

export interface ChannelBrandingSettings {
  image?: {
    bannerExternalUrl?: string;
  };
}

export interface ChannelStatistics {
  viewCount: string;
  subscriberCount?: string;
  videoCount?: string;
}

export interface PlaylistItem {
  contentDetails: { videoId: string };
  snippet?: {
    title?: string;
    description?: string;
    thumbnails?: {
      default?: { url: string };
      medium?: { url: string };
      high?: { url: string };
    };
  };
}

export interface VideoItemSnippet {
  id: string;                  // video ID
  title: string;               // video title
  description: string;         // video description
  channelId: string;           // ID of the channel
  channelTitle: string;        // name of the channel
  channelAvatar?: string;      // optional, avatar URL for UI
  publishedAt: string;         // ISO date string
  viewCount?: number;          // optional, number of views
  duration?: string;           // optional, ISO 8601 duration
}


export interface YouTubeVideoItem {
  id: string;
  snippet: {
    title: string;
    description: string;
    channelId: string;
    channelTitle: string;
    publishedAt: string;
  };
  statistics?: {
    viewCount?: string;
    likeCount?: string;
  };
  contentDetails?: {
    duration?: string;
  };
}

// App type (used for UI)
export interface VideoItem {
  id: string;
  title: string;
  description: string;
  channelTitle: string;
  channelAvatar: string;
  channelId: string;
  publishedAt: string;
  viewCount?: number;
  duration?: string;
  thumbnail: string;
}


export interface SafeAreaLayoutProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export interface Props {
  videoId: string;
  userAvatar: string;
}

export interface RecommendedVideo {
  id: string;
  title: string;
  channelTitle: string;
  channelId: string;
  thumbnail: string;
  viewCount?: number;
  publishedAt?: string;
}

export interface RecommendedListProps {
  videos: RecommendedVideo[];
}

export interface YouTubeResponse<T> {
  items: T[];
  nextPageToken?: string;
}

export interface ShortVideo {
  id: string;
  title: string;
  channelTitle: string;
  channelId: string;
  channelAvatar: string;
  description: string;
}

// Flattened Comment type for both API and UI
export interface Comment {
  id: string;
  authorDisplayName: string;
  authorProfileImageUrl: string;
  textOriginal: string;
  publishedAt: string;
  replies?: Comment[]; // optional nested replies
}

// API response wrapper for comments
export interface CommentsResponse {
  items: Comment[];
  nextPageToken?: string;
}

export interface ChannelItem {
  id: string;
  kind?: string;
  etag?: string;
  snippet: {
    title: string;
    description: string;
    customUrl?: string;
    publishedAt?: string;
    thumbnails: {
      default: { url: string; width?: number; height?: number };
      medium?: { url: string; width?: number; height?: number };
      high?: { url: string; width?: number; height?: number };
    };
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


export interface UseCommentsProps {
  videoId: string;
  maxResults?: number;
}
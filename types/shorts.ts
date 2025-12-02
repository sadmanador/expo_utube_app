export interface VideoSnippet {
  publishedAt: string;
  channelId: string;
  title: string;
  description: string;
  thumbnails: VideoThumbnails;
  channelTitle: string;
  tags?: string[];
  categoryId: string;
  liveBroadcastContent: string;
  defaultLanguage?: string;
  localized: Localized;
  defaultAudioLanguage?: string;
}

export interface VideoThumbnails {
  default: ThumbnailDetail;
  medium?: ThumbnailDetail;
  high?: ThumbnailDetail;
  standard?: ThumbnailDetail;
  maxres?: ThumbnailDetail;
}

export interface ThumbnailDetail {
  url: string;
  width?: number;
  height?: number;
}

export interface Localized {
  title: string;
  description: string;
}

export interface YouTubeShortVideo {
  kind: string;
  etag: string;
  id: string;
  snippet: VideoSnippet;
}

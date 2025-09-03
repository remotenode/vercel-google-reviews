export interface Review {
  id: string;
  userName: string;
  userImage: string | null;
  date: string;
  score: number;
  scoreText: string;
  url: string;
  title: string | null;
  text: string;
  replyDate: string | null;
  replyText: string | null;
  version: string;
  thumbsUp: number | null;
  criterias: any[];
}

export interface GooglePlayReview {
  userName?: string;
  author?: string;
  score?: number;
  rating?: number;
  date?: string;
  time?: string;
  text?: string;
  body?: string;
  reviewId?: string;
  id?: string;
  appVersion?: string;
  language?: string;
}

export interface ScraperOptions {
  appId: string;
  country?: string;
  lang?: string;
  num?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  statusCode: number;
  timestamp: string;
  details?: string;
  recommendation?: string;
}

export interface HealthResponse {
  status: string;
  timestamp: string;
  uptime: number;
  memory: NodeJS.MemoryUsage;
  version: string;
}

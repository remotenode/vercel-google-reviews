// Core types for the Google Reviews API

export interface Review {
  id: string;
  userName: string;
  userImage: string;
  content?: string;
  text?: string;
  score: number;
  thumbsUpCount?: number;
  thumbsUp?: number;
  reviewCreatedVersion?: string;
  version?: string;
  at?: string;
  date: string;
  replyContent?: string;
  repliedAt?: string;
  replyDate?: string | null;
  replyText?: string | null;
  scoreText?: string;
  url?: string;
  title?: string | null;
  criterias?: Criteria[];
}

export interface Criteria {
  criteria: string;
  rating: number | null;
}

export interface ReviewResponse {
  data: Review[];
}

export interface ApiError {
  error: string;
  statusCode: number;
}

export interface ReviewOptions {
  appId: string;
  country?: string;
  lang?: string;
  num?: number;
  sort?: string;
}

export interface Language {
  code: string;
  language: string;
}

export interface SwaggerSpec {
  openapi: string;
  info: {
    title: string;
    description: string;
    version: string;
    contact: {
      name: string;
      url: string;
    };
  };
  servers: Array<{
    url: string;
    description: string;
  }>;
  paths: Record<string, any>;
  components: {
    schemas: Record<string, any>;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  statusCode: number;
  timestamp: string;
}

export interface RequestContext {
  appId: string;
  country?: string;
  lang?: string;
  userAgent?: string;
  ip?: string;
}

export interface PerformanceMetrics {
  startTime: number;
  endTime: number;
  duration: number;
  memoryUsage: NodeJS.MemoryUsage;
}

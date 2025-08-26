// src/types/index.ts
// 인증 관련 타입들
export * from './auth';

// 캘린더 관련 타입들
export * from './calendar';

// 공통 타입들
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginationResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasNext: boolean;
  hasPrev: boolean;
}
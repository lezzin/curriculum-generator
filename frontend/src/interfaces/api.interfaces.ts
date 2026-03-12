export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}

export type ApiRequestParams = Record<string, any>;

import type { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';

interface RetryRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

type QueueItem = {
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
};

let isRefreshing = false;
let failedQueue: QueueItem[] = [];

function processQueue(error: unknown) {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve();
  });
  failedQueue = [];
}

function isAuthError(error: AxiosError): boolean {
  return error.response?.status === 401;
}

function isAuthRequest(url?: string) {
  if (!url) return false;
  return url.endsWith('/auth/login') || url.endsWith('/auth/register');
}

function isRefreshRequest(url?: string) {
  if (!url) return false;
  return url.endsWith('/auth/refresh');
}

export function setupInterceptors(api: AxiosInstance, onRefreshFailed?: () => void) {
  api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as RetryRequestConfig;

      if (!originalRequest) {
        return Promise.reject(error);
      }

      if (isAuthRequest(originalRequest.url)) {
        return Promise.reject(error);
      }

      if (isRefreshRequest(originalRequest.url) && isAuthError(error)) {
        isRefreshing = false;
        processQueue(error);
        onRefreshFailed?.();
        return Promise.reject(error);
      }

      if (!isAuthError(error) || originalRequest._retry) {
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: () => resolve(api(originalRequest)),
            reject: (err) => reject(err),
          });
        });
      }

      isRefreshing = true;

      try {
        await api.post('/auth/refresh');
        processQueue(null);
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);
        onRefreshFailed?.();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
  );
}

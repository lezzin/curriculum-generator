import { ref } from 'vue';
import type { AxiosInstance } from 'axios';
import type { HttpMethod } from './types/http-method.types';
import { extractErrorMessage } from '../../helper/error.helper';
import type { ApiResponse, ApiRequestParams } from '../../interfaces/api.interfaces';

export function createApi(api: AxiosInstance) {
  const loading = ref(false);
  const apiUrl = api.defaults.baseURL as string;

  async function request<T>(
    method: HttpMethod,
    path: string,
    params?: ApiRequestParams,
    useLoading = true
  ): Promise<ApiResponse<T>> {
    if (useLoading) loading.value = true;

    try {
      const result = await api.request({
        method,
        url: path,
        ...(method === 'get' ? { params } : { data: params }),
      });

      return { data: result.data as T, error: null };
    } catch (err) {
      return { data: null, error: extractErrorMessage(err) };
    } finally {
      if (useLoading) loading.value = false;
    }
  }

  return {
    loading,
    apiUrl,
    request,
  };
}

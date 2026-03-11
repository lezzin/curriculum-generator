import { ref } from 'vue';
import type { AxiosInstance } from 'axios';
import type { HttpMethod } from './types/http-method.types';
import { extractErrorMessage } from '../../helper/error.helper';

export function createApi(api: AxiosInstance) {
  const loading = ref(false);
  const apiUrl = api.defaults.baseURL as string;

  async function request<T>(
    method: HttpMethod,
    path: string,
    params?: any,
    useLoading = true
  ): Promise<{ data: T | null; error: string | null }> {
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

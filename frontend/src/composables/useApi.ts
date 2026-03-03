import { ref } from "vue";
import { api } from "../services/api/api";
import { extractErrorMessage } from "../helper/error.helper";

const apiUrl = api.defaults.baseURL as string;

type HttpMethod = 'get' | 'post' | 'put' | 'patch' | 'delete'

export function useApi() {
    const loading = ref(false)

    async function request<T>(
        method: HttpMethod,
        path: string,
        params?: any,
        useLoading = true
    ): Promise<{ data: T | null; error: string | null }> {
        if (useLoading) loading.value = true;

        try {
            const result = params ? await api[method](path, params) : await api[method](path);
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
        request
    };
}
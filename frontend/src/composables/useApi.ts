import { ref } from "vue"
import { extractErrorMessage } from "../helper/error.helper"
import { api } from "../services/api/api"

const apiUrl = api.defaults.baseURL;

type HttpMethod = 'get' | 'post' | 'put' | 'patch' | 'delete'

export function useApi() {
    const loading = ref(false)

    async function request<T>(
        method: HttpMethod,
        path: string,
        params: any = null,
        useLoading = true
    ): Promise<T | null> {
        try {
            if (useLoading) loading.value = true

            const result = !!params
                ? await api[method](path, params)
                : await api[method](path)

            return result.data as T
        } catch (err) {
            throw new Error(extractErrorMessage(err))
        } finally {
            if (useLoading) loading.value = false
        }
    }

    return {
        loading,
        apiUrl,
        request
    }
}
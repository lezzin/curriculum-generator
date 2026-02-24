import axios, { type AxiosInstance } from "axios"
import { ref } from "vue"
import { config } from "../config/variables.config"
import { extractErrorMessage } from "../helper/error.helper"

export function useApi() {
    const error = ref<string | null>(null)
    const loading = ref(false)

    const api: AxiosInstance = axios.create({
        baseURL: config.apiUrl,
        withCredentials: true,
        headers: {
            "Content-Type": "application/json",
        }
    })

    async function request<T>(
        callback: () => Promise<T>,
        useLoading = true
    ): Promise<T> {
        try {
            if (useLoading) loading.value = true
            error.value = null

            const result = await callback()
            return result
        } catch (err) {
            const message = extractErrorMessage(err)
            error.value = message
            throw new Error(message)
        } finally {
            if (useLoading) loading.value = false
        }
    }

    return {
        api,
        error,
        loading,
        request
    }
}
import axios, { type AxiosInstance } from "axios"
import { ref } from "vue"
import { config } from "../config/variables.config"
import { extractErrorMessage } from "../helper/error.helper"

export function useApi() {
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
    ): Promise<T | null> {
        try {
            if (useLoading) loading.value = true
            const result = await callback()
            return result
        } catch (err) {
            throw new Error(extractErrorMessage(err))
        } finally {
            if (useLoading) loading.value = false
        }
    }

    return {
        api,
        loading,
        request
    }
}
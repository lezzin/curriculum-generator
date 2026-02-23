import axios from "axios"
import { ref } from "vue"
import { config } from "../config/variables.config"
import { extractErrorMessage } from "../helper/error.helper"

export function useApi() {
    const error = ref("")
    const loading = ref(false)

    const api = axios.create({
        baseURL: config.apiUrl
    })

    async function request<T>(
        callback: () => Promise<T>,
        useLoading = true
    ): Promise<T | undefined> {
        try {
            if (useLoading) loading.value = true
            error.value = ""
            return await callback()
        } catch (err) {
            console.error(err)
            error.value = extractErrorMessage(err)
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
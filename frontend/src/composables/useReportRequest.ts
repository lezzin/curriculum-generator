import { storeToRefs } from "pinia"
import { useReportApi } from "./api/useReportApi"
import { useToast } from "./useToast"
import { useAuthStore } from "../stores/auth"

export function useReportRequest(endpoint: string) {
    const { request, loading } = useReportApi()
    const { show } = useToast()
    const { user } = storeToRefs(useAuthStore())

    async function submit(payload: any) {
        const { error } = await request('post', endpoint, {
            user_uuid: user.value?.id,
            ...payload
        })

        if (!error) {
            return true
        }

        show({
            message: error,
            type: 'error'
        })

        return false
    }

    return {
        submit,
        loading
    }
}
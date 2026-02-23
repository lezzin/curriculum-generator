import { ref, onUnmounted } from "vue"
import type { AxiosInstance } from "axios"

export function usePdf(api: AxiosInstance) {
    const pdfUrl = ref<string | null>(null)
    const isGenerating = ref(false)

    function getPublicPdfUrl(id: string): string {
        const base = api.defaults.baseURL ?? ""
        return `${base}/resume/pdf/${id}`
    }

    function revoke() {
        if (pdfUrl.value) {
            URL.revokeObjectURL(pdfUrl.value)
            pdfUrl.value = null
        }
    }

    onUnmounted(revoke)

    return {
        pdfUrl,
        isGenerating,
        getPublicPdfUrl,
        revoke
    }
}
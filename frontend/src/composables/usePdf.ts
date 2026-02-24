import { ref, onUnmounted } from "vue"
import { useApi } from "./useApi"

const { api, request } = useApi()

export function usePdf() {
    const pdfUrl = ref<string | null>(null)
    const isGenerating = ref(false)

    async function getPublicPdfUrl(id: string): Promise<string> {
        const response = await request(async () => {
            return await api.get(`/resume/pdf/${id}`)
        })

        return response.data;
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
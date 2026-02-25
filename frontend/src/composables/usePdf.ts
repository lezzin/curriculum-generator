import { ref, onUnmounted } from "vue"
import { useApi } from "./useApi"

const { api } = useApi()

export function usePdf() {
    const pdfUrl = ref<string | null>(null)
    const isGenerating = ref(false)

    async function getPublicPdfUrl(id: string): Promise<string> {
        const response = await api.get(`/resume/pdf/${id}`, {
            responseType: 'arraybuffer',
        });

        const pdfBlob = new Blob([response.data], { type: 'application/pdf' });

        return URL.createObjectURL(pdfBlob);
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
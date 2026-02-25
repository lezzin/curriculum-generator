import { ref, onUnmounted } from "vue"
import { useApi } from "./useApi"

const { api } = useApi()

export function usePdf() {
    const pdfUrl = ref<string | null>(null)
    const isGenerating = ref(false)

    async function setPublicPdfUrl(id: string) {
        const response = await api.get(`/resume/pdf/${id}`, {
            responseType: 'arraybuffer',
        });

        const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
        pdfUrl.value = URL.createObjectURL(pdfBlob);
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
        setPublicPdfUrl,
        revoke
    }
}
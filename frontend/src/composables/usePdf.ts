import { ref, onUnmounted } from "vue"
import type { AxiosInstance } from "axios"
import type { Resume } from "../interfaces/resume.interfaces"

export function usePdf(api: AxiosInstance) {
    const pdfUrl = ref<string | null>(null)
    const isGenerating = ref(false)

    function getPublicPdfUrl(id: string): string {
        const base = api.defaults.baseURL ?? ""
        return `${base}/resume/pdf/${id}`
    }

    async function generatePdf(resume: Resume) {
        if (!resume) return

        isGenerating.value = true

        try {
            const response = await api.post(
                `/resume/pdf/generate`,
                resume,
                { responseType: "blob" }
            )

            const blob = response.data as Blob

            revoke()

            pdfUrl.value = URL.createObjectURL(blob)
        } finally {
            isGenerating.value = false
        }
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
        generatePdf,
        getPublicPdfUrl,
        revoke
    }
}
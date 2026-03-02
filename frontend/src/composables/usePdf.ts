import { ref, onUnmounted } from "vue"
import { useApi } from "./useApi"

const { request, apiUrl } = useApi()

export function usePdf() {
    const pdfUrl = ref<string | null>(null)
    const pageUrl = ref<string | null>(null)
    const isGenerating = ref(false)

    async function setPublicPdfUrl(id: string) {
        const response = await request<BlobPart>('get', `/resume/pdf/${id}`, {
            responseType: 'arraybuffer',
        });

        if (!response) {
            pdfUrl.value = null;
            return;
        }

        const pdfBlob = new Blob([response], { type: 'application/pdf' });
        pdfUrl.value = URL.createObjectURL(pdfBlob);
    }

    async function setPublicPageUrl(id: string) {
        pageUrl.value = `${apiUrl}/resume/page/${id}`;
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
        pageUrl,
        isGenerating,
        setPublicPdfUrl,
        setPublicPageUrl,
        revoke
    }
}
import { onMounted, onUnmounted } from "vue"
import type { AxiosInstance } from "axios"

interface UseSSEOptions<T> {
    api: AxiosInstance
    eventName: string
    onEvent: (payload: T) => void
    onError?: () => void
}

export function useSSE<T>({
    api,
    eventName,
    onEvent,
    onError
}: UseSSEOptions<T>) {
    let eventSource: EventSource | null = null

    onMounted(() => {
        eventSource = new EventSource(`${api.defaults.baseURL}/events`)

        eventSource.onmessage = (event) => {
            try {
                const data: {
                    event: string
                    data: T
                } = JSON.parse(event.data)

                if (data.event === eventName) {
                    onEvent(data.data)
                }
            } catch (err) {
                console.error("Erro ao processar evento SSE", err)
            }
        }

        eventSource.onerror = () => {
            onError?.()
        }
    })

    onUnmounted(() => {
        eventSource?.close()
        eventSource = null
    })
}
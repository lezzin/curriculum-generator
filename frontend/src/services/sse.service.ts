import type { AxiosInstance } from "axios"

type SSECallback<T = any> = (payload: T) => void

class SSEService {
    private api!: AxiosInstance
    private eventSource: EventSource | null = null
    private listeners = new Map<string, SSECallback[]>()
    private reconnectInterval = 3000

    init(api: AxiosInstance) {
        if (this.eventSource) return
        this.api = api
        this.connect()
    }

    private connect() {
        this.eventSource = new EventSource(`${this.api.defaults.baseURL}/events`)

        this.eventSource.onmessage = (event) => {
            try {
                const parsed = JSON.parse(event.data)
                const callbacks = this.listeners.get(parsed.event)
                callbacks?.forEach(cb => cb(parsed.data))
            } catch (err) {
                console.error("Erro ao processar SSE:", err)
            }
        }

        this.eventSource.onerror = () => {
            console.warn("SSE desconectado, tentando reconectar...")
            this.eventSource?.close()
            this.eventSource = null
            setTimeout(() => this.connect(), this.reconnectInterval)
        }
    }

    on<T>(eventName: string, callback: (payload: T) => void) {
        if (!this.listeners.has(eventName)) {
            this.listeners.set(eventName, [])
        }

        this.listeners.get(eventName)!.push(callback)
    }

    off(eventName: string, callback?: SSECallback) {
        if (!callback) {
            this.listeners.delete(eventName)
            return
        }

        const callbacks = this.listeners.get(eventName)
        if (!callbacks) return

        this.listeners.set(
            eventName,
            callbacks.filter(cb => cb !== callback)
        )
    }

    close() {
        this.eventSource?.close()
        this.eventSource = null
        this.listeners.clear()
    }
}

export const sseService = new SSEService()
import { ref } from "vue"

export type ToastType = "success" | "error" | "warning" | "info"

export interface Toast {
    id: number
    message: string
    type: ToastType
    duration: number
}

const toasts = ref<Toast[]>([])
let idCounter = 0

export function useToast() {
    function show(
        message: string,
        type: ToastType = "success",
        duration = 4000
    ) {
        const id = idCounter++

        const toast: Toast = {
            id,
            message,
            type,
            duration
        }

        toasts.value.push(toast)

        if (duration > 0) {
            setTimeout(() => {
                remove(id)
            }, duration)
        }
    }

    function remove(id: number) {
        toasts.value = toasts.value.filter(t => t.id !== id)
    }

    return {
        toasts,
        show,
        remove
    }
}
import { AxiosError } from "axios"

export function extractErrorMessage(err: unknown): string {
    if (err instanceof AxiosError) {
        const data = err.response?.data

        if (!data) return "Erro inesperado."

        if (Array.isArray(data.message)) {
            return data.message.join(", ")
        }

        return data.message || "Erro inesperado."
    }

    if (err instanceof Error) {
        return err.message
    }

    return "Erro inesperado."
}
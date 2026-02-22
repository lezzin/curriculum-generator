export function extractErrorMessage(err: any): string {
    const data = err?.response?.data

    if (!data) return "Erro inesperado."

    if (Array.isArray(data.message)) {
        return data.message.join(", ")
    }

    return data.message || "Erro inesperado."
}
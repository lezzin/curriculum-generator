import { reactive, computed } from "vue"

export function useProfileValidation(state: any) {
    const errors = reactive({
        type: "",
        description: "",
    })

    function validateRequired(field: keyof typeof errors, value: string) {
        if (!value) {
            errors[field] = "Campo obrigatório."
            return false
        }

        errors[field] = ""
        return true
    }

    const isFormValid = computed(() =>
        state.type &&
        state.description
    )

    return {
        errors,
        validateRequired,
        isFormValid,
    }
}
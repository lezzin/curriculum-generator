import { reactive, computed } from "vue"

export function useAuthValidation(state: any) {
    const errors = reactive({
        email: "",
        password: "",
        username: "",
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
        state.email.length >= 3 &&
        state.password.length >= 6 &&
        state.email
    )

    return {
        errors,
        validateRequired,
        isFormValid,
    }
}
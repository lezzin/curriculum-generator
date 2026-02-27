import { computed, reactive } from "vue"

export function useConfigValidation(state: any) {
    const errors = reactive({
        linkedin: "",
        github: "",
        portfolio: "",
        cellphone: "",
    })

    function isValidUrl(value: string) {
        try {
            new URL(value)
            return true
        } catch {
            return false
        }
    }

    function isValidPhone(value: string) {
        const phoneRegex = /^(?:\+55\s?)?(?:\(?\d{2}\)?\s?)?(?:9?\d{4})-?\d{4}$/
        return phoneRegex.test(value)
    }

    function validateUrl(field: keyof typeof errors, value: string) {
        if (!value) {
            errors[field] = ""
            return true
        };

        if (!isValidUrl(value)) {
            errors[field] = "URL inválida."
            return false
        }

        errors[field] = ""
        return true
    }

    function validatePhone(value: string) {
        if (!value) {
            errors.cellphone = ""
            return true
        };

        if (!isValidPhone(value)) {
            errors.cellphone = "Telefone inválido."
            return false
        }

        errors.cellphone = ""
        return true
    }

    const isFormValid = computed(() => {
        const validUrlFields =
            validateUrl("linkedin", state.linkedin) &&
            validateUrl("github", state.github) &&
            validateUrl("portfolio", state.portfolio)

        const validPhone = validatePhone(state.cellphone)

        return validUrlFields && validPhone
    })

    return {
        errors,
        validateUrl,
        validatePhone,
        isFormValid
    }
}
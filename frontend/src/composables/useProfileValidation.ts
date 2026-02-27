import { reactive, computed } from "vue"
import { DESCRIPTION_LENGTH } from "../constants/app.constants"

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

    function validateDescription() {
        if (!state.description.trim()) {
            errors.description = "A descrição é obrigatória."
            return false
        }

        if (state.description.trim().length < DESCRIPTION_LENGTH.min) {
            errors.description = `A descrição precisa ter pelo menos ${DESCRIPTION_LENGTH.min} caracteres.`
            return false
        }

        if (state.description.trim().length > DESCRIPTION_LENGTH.max) {
            errors.description = `A descrição precisa ter até no máximo ${DESCRIPTION_LENGTH.max} caracteres.`
            return false
        }

        errors.description = ""
        return true
    }

    const isFormValid = computed(() =>
        state.type &&
        state.description &&
        state.description.trim().length >= DESCRIPTION_LENGTH.min &&
        state.description.trim().length <= DESCRIPTION_LENGTH.max
    )

    return {
        errors,
        validateRequired,
        validateDescription,
        isFormValid,
    }
}
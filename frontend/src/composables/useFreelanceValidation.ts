import { reactive, computed } from "vue"
import { DESCRIPTION_LENGTH } from "../constants/app.constants"

export function useFreelanceValidation(state: any) {
    const errors = reactive({
        solicitationText: "",
    })

    function validateForm() {
        const isValid = validateSolicitationText()
        return isValid
    }

    function validateSolicitationText() {
        if (!state.solicitationText.trim()) {
            errors.solicitationText = "A descrição da solicitação é obrigatória."
            return false
        }

        if (state.solicitationText.trim().length < DESCRIPTION_LENGTH.min) {
            errors.solicitationText = `A descrição precisa ter pelo menos ${DESCRIPTION_LENGTH.min} caracteres.`
            return false
        }

        if (state.solicitationText.trim().length > DESCRIPTION_LENGTH.max) {
            errors.solicitationText = `A descrição precisa ter até no máximo ${DESCRIPTION_LENGTH.max} caracteres.`
            return false
        }

        errors.solicitationText = ""
        return true
    }

    const isFormValid = computed(() =>
        state.solicitationText.trim().length >= DESCRIPTION_LENGTH.min &&
        state.solicitationText.trim().length <= DESCRIPTION_LENGTH.max
    )

    return {
        errors,
        validateSolicitationText,
        validateForm,
        isFormValid
    }
}
import { reactive, computed } from "vue"
import { DESCRIPTION_LENGTH } from "../constants/app.constants"

export function useResumeValidation(state: any) {
    const errors = reactive({
        jobText: "",
        language: "",
        seniority: "",
        focusArea: "",
        market: ""
    })

    function validateRequired(field: keyof typeof errors, value: string) {
        if (!value) {
            errors[field] = "Campo obrigatório."
            return false
        }

        errors[field] = ""
        return true
    }

    function validateJobText() {
        const text = state.jobText.trim()

        if (!text) {
            errors.jobText = "A descrição da vaga é obrigatória."
            return false
        }

        if (text.length < DESCRIPTION_LENGTH.min) {
            errors.jobText = `Mínimo ${DESCRIPTION_LENGTH.min} caracteres.`
            return false
        }

        if (text.length > DESCRIPTION_LENGTH.max) {
            errors.jobText = `Máximo ${DESCRIPTION_LENGTH.max} caracteres.`
            return false
        }

        errors.jobText = ""
        return true
    }

    const isFormValid = computed(() =>
        state.jobText.trim().length >= DESCRIPTION_LENGTH.min &&
        state.jobText.trim().length <= DESCRIPTION_LENGTH.max &&
        state.language &&
        state.seniority &&
        state.focusArea &&
        state.market
    )

    return {
        errors,
        validateJobText,
        validateRequired,
        isFormValid
    }
}
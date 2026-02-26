import { reactive, computed } from "vue"
import { DESCRIPTION_LENGTH } from "../constants/app.constants"

export function useResumeValidation(state: any) {
    const errors = reactive({
        jobText: "",
        language: "",
        seniority: "",
        focusArea: "",
        market: "",
        templateType: ""
    })

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
        state.market &&
        state.templateType
    )

    return {
        errors,
        validateJobText,
        isFormValid
    }
}
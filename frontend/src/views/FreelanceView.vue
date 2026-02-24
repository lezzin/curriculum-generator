<script setup lang="ts">
import { reactive, watch } from "vue"
import BaseButton from "../components/ui/BaseButton.vue"
import AppTitle from "../components/layout/AppTitle.vue"
import TextAreaField from "../components/ui/form/TextAreaField.vue"
import { useFreelanceValidation } from "../composables/useFreelanceValidation"
import { useApi } from "../composables/useApi"
import { useToast } from "../composables/useToast"

const { show } = useToast()

const state = reactive({
    solicitationText: "",
    error: "",
})

const { api, loading: isGeneratingProposal, request } = useApi()
const { errors, validateSolicitationText, validateForm, isFormValid } = useFreelanceValidation(state)

async function generateProposal() {
    if (!validateForm()) return

    await request(async () => {
        await api.post("/freelance/proposal/generate", {
            solicitation: state.solicitationText,
        }).then(response => {
            show(response.data.message ?? "Solicitação enviada com sucesso!")
        }).catch(() => {
            show({
                message: "Ocorreu um erro ao enviar a solicitação. Tente novamente mais tarde.",
                type: "error",
            })
        })
    })
}

watch(() => state.solicitationText, validateSolicitationText)
</script>

<template>
    <AppTitle title="Gerar Proposta" />

    <div class="space-y-4 mt-6">
        <TextAreaField label="Descrição da solicitação" v-model="state.solicitationText" :rows="10"
            placeholder="Cole a descrição da solicitação..." :error="errors.solicitationText" />

        <BaseButton @click="generateProposal" :disabled="!isFormValid || isGeneratingProposal"
            :loading="isGeneratingProposal">
            Gerar Proposta
        </BaseButton>

        <p v-if="state.error" class="text-red-500 text-sm">
            {{ state.error }}
        </p>
    </div>
</template>
<script setup lang="ts">
import { reactive, watch } from "vue"
import BaseButton from "../components/ui/BaseButton.vue"
import AppTitle from "../components/layout/AppTitle.vue"
import TextAreaField from "../components/ui/form/TextAreaField.vue"
import type { MarketplaceProposal } from "../interfaces/freelance.interfaces"
import ProposalPreview from "../components/freelance/ProposalPreview.vue"
import { useFreelanceValidation } from "../composables/useFreelanceValidation"
import { useApi } from "../composables/useApi"

const state = reactive({
    solicitationText: "",
    proposal: null as MarketplaceProposal | null,
    error: "",
})

const { api, loading: isGeneratingProposal, request } = useApi()
const { errors, validateSolicitationText, validateForm, isFormValid } = useFreelanceValidation(state)

async function generateProposal() {
    if (!validateForm()) return

    const data = await request(async () => {
        const response = await api.post("/freelance/proposal/generate", {
            solicitation: state.solicitationText,
        })

        return response.data as MarketplaceProposal
    })

    if (!data) return

    state.proposal = data
}

watch(() => state.solicitationText, validateSolicitationText)
</script>

<template>
    <AppTitle title="Freelance" />

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

    <ProposalPreview v-if="state.proposal" :proposal="state.proposal" />
</template>
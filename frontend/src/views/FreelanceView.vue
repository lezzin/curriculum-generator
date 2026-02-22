<script setup lang="ts">
import { reactive, computed, watch } from "vue"
import axios from "axios"
import { config } from "../config/variables.config"
import { extractErrorMessage } from "../helper/error.helper"
import BaseButton from "../components/ui/BaseButton.vue"
import AppTitle from "../components/layout/AppTitle.vue"
import TextAreaField from "../components/ui/form/TextAreaField.vue"
import type { MarketplaceProposal } from "../interfaces/freelance.interfaces"
import ProposalPreview from "../components/freelance/ProposalPreview.vue"

const state = reactive({
    solicitationText: "",
    proposal: null as MarketplaceProposal | null,
    isGeneratingProposal: false,
    error: "",
})

const errors = reactive({
    solicitationText: "",
})

function validateSolicitationText() {
    if (!state.solicitationText.trim()) {
        errors.solicitationText = "A descrição da solicitação é obrigatória."
        return false
    }

    if (state.solicitationText.trim().length < 30) {
        errors.solicitationText = "A descrição precisa ter pelo menos 30 caracteres."
        return false
    }

    if (state.solicitationText.trim().length > 500) {
        errors.solicitationText = "A descrição precisa ter até no máximo 500 caracteres."
        return false
    }

    errors.solicitationText = ""
    return true
}

function validateForm() {
    const isValid = validateSolicitationText()
    return isValid
}

const isFormValid = computed(() =>
    state.solicitationText.trim().length >= 30 &&
    state.solicitationText.trim().length <= 500
)

const api = axios.create({
    baseURL: config.apiUrl
})

async function handleRequest<T>(request: () => Promise<T>,) {
    try {
        state.isGeneratingProposal = true
        state.error = ""
        return await request()
    } catch (err) {
        console.error(err)
        state.error = extractErrorMessage(err)
    } finally {
        state.isGeneratingProposal = false
    }
}

async function generateProposal() {
    if (!validateForm()) return

    const data = await handleRequest(async () => {
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

        <BaseButton @click="generateProposal" :disabled="!isFormValid || state.isGeneratingProposal"
            :loading="state.isGeneratingProposal">
            Gerar Proposta
        </BaseButton>

        <p v-if="state.error" class="text-red-500 text-sm">
            {{ state.error }}
        </p>
    </div>

    <ProposalPreview v-if="state.proposal" :proposal="state.proposal" />
</template>
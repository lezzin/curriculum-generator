<script setup lang="ts">
import { reactive } from "vue"
import BaseButton from "../../components/ui/BaseButton.vue"
import AppTitle from "../../components/layout/AppTitle.vue"
import TextAreaField from "../../components/ui/form/TextAreaField.vue"
import { useFreelanceValidation } from "../../composables/useFreelanceValidation"
import { useApi } from "../../composables/useApi"
import { useToast } from "../../composables/useToast"

const { show } = useToast()

const state = reactive({
    solicitationText: "",
    error: "",
})

const { api, loading: isSendingRequest, request } = useApi()
const { errors, validateForm, isFormValid } = useFreelanceValidation(state)

async function generateProposal() {
    if (!validateForm()) return

    await request(async () => {
        await api.post("/freelance/proposal/generate", {
            solicitation: state.solicitationText,
        }).then(response => {
            state.solicitationText = ""
            show(response.data.message ?? "Solicitação de proposta enviada com sucesso!")
        }).catch(() => {
            show({
                message: "Ocorreu um erro ao enviar a solicitação. Tente novamente mais tarde.",
                type: "error",
            })
        })
    })
}
</script>

<template>
    <AppTitle title="Gerar Proposta Personalizada"
        subtitle="Crie uma proposta estratégica com base na solicitação recebida." />

    <div class="space-y-4 mt-6">
        <TextAreaField label="Descrição completa da solicitação" v-model="state.solicitationText" :rows="10"
            placeholder="Cole aqui todos os detalhes da solicitação. Quanto mais informações, mais personalizada será a proposta."
            :error="errors.solicitationText" />

        <BaseButton @click="generateProposal" :disabled="!isFormValid || isSendingRequest" :loading="isSendingRequest">
            Gerar proposta personalizada
        </BaseButton>

        <p v-if="state.error" class="text-red-500 text-sm">
            {{ state.error }}
        </p>
    </div>
</template>
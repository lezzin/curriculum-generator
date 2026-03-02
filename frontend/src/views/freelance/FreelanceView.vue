<script setup lang="ts">
import BaseButton from "../../components/ui/BaseButton.vue"
import AppTitle from "../../components/layout/AppTitle.vue"
import TextAreaField from "../../components/ui/form/TextAreaField.vue"
import { useApi } from "../../composables/useApi"
import { useToast } from "../../composables/useToast"
import { useForm } from "vee-validate"
import { freelanceSchema, MAX_LENGTH, type FreelanceForm } from "../../components/validation/schemas/freelance.schema"
const { show } = useToast()

const { handleSubmit } = useForm<FreelanceForm>({
    validationSchema: freelanceSchema,
    initialValues: {
        solicitationText: ''
    }
})

const { loading: isLoading, request } = useApi()

const generateProposal = handleSubmit(async (form) => {
    try {
        const message = await request<string>('post', '/freelance/proposal/generate', {
            solicitation: form.solicitationText,
        })

        show(message ?? "Solicitação de proposta enviada com sucesso!")
    } catch (err: any) {
        show({
            message: err.message || "Ocorreu um erro ao enviar a solicitação. Tente novamente mais tarde.",
            type: "error",
        })
    }
})
</script>

<template>
    <AppTitle title="Gerar Proposta Personalizada"
        subtitle="Crie uma proposta estratégica com base na solicitação recebida." />

    <form class="space-y-10" @submit.prevent="generateProposal">
        <div class="space-y-4">
            <TextAreaField name="solicitationText" label="Descrição completa da solicitação" :rows="10"
                :max-length="MAX_LENGTH" :show-length="true"
                placeholder="Cole aqui todos os detalhes da solicitação. Quanto mais informações, mais personalizada será a proposta." />

            <BaseButton type="submit" :disabled="isLoading" :loading="isLoading">
                Gerar proposta personalizada
            </BaseButton>
        </div>
    </form>
</template>
<script setup lang="ts">
import BaseButton from "../../components/ui/BaseButton.vue"
import AppTitle from "../../components/layout/AppTitle.vue"
import TextAreaField from "../../components/ui/form/TextAreaField.vue"
import { useApi } from "../../composables/useApi"
import { useToast } from "../../composables/useToast"
import * as yup from "yup";
import { useForm } from "vee-validate"
const { show } = useToast()

const freelanceSchema = yup.object({
    solicitationText: yup.string()
        .required("Campo obrigatório")
        .min(25, "Mínimo 25 caracteres")
        .max(3000, "Máximo 3000 caracteres"),
})

const { handleSubmit } = useForm({
    validationSchema: freelanceSchema,
    initialValues: {
        solicitationText: ''
    }
})

const { api, loading, request } = useApi()

const generateProposal = handleSubmit(async (form) => {
    try {
        await request(async () => {
            const response = await api.post("/freelance/proposal/generate", {
                solicitation: form.solicitationText,
            })

            show(response.data.message ?? "Solicitação de proposta enviada com sucesso!")
        })
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
                placeholder="Cole aqui todos os detalhes da solicitação. Quanto mais informações, mais personalizada será a proposta." />

            <BaseButton type="submit" :disabled="loading" :loading="loading">
                Gerar proposta personalizada
            </BaseButton>
        </div>
    </form>
</template>
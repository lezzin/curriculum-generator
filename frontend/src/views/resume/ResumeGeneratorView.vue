<script setup lang="ts">
import { computed } from "vue"
import { useApi } from "../../composables/useApi"
import BaseButton from "../../components/ui/BaseButton.vue"
import TextAreaField from "../../components/ui/form/TextAreaField.vue"
import SelectField from "../../components/ui/form/SelectField.vue"
import AppTitle from "../../components/layout/AppTitle.vue"
import { useToast } from "../../composables/useToast"
import { BASE_TEMPLATE_TYPES } from "../../interfaces/resume.interfaces"
import { capitalizeFirst } from "../../helper/string.helper"
import * as yup from 'yup';
import { useForm } from "vee-validate"

const { show } = useToast()

const resumeSchema = yup.object({
    jobText: yup.string().required("Campo obrigatório").min(25, "Mínimo 25 caracteres").max(3000, "Máximo 3000 caracteres"),
    language: yup.string().required("Campo obrigatório"),
    seniority: yup.string().required("Campo obrigatório"),
    focusArea: yup.string().required("Campo obrigatório"),
    market: yup.string().required("Campo obrigatório"),
    templateType: yup.string().required("Campo obrigatório"),
})

const { handleSubmit } = useForm({
    validationSchema: resumeSchema,
    initialValues: {
        language: 'PT',
        seniority: 'Junior',
        focusArea: 'Backend',
        market: 'Brazil',
        templateType: 'default',
        jobText: '',
    }
})

const { api, loading, request } = useApi()

const templateTypes = computed(() => Object.values(BASE_TEMPLATE_TYPES))

const generateResume = handleSubmit(async (form) => {
    try {
        await request(async () => {
            const response = await api.post("/resume/generate", {
                jobDescription: form.jobText,
                options: {
                    language: form.language,
                    targetSeniority: form.seniority,
                    focusArea: form.focusArea,
                    market: form.market,
                    template: form.templateType
                }
            })

            show(response.data.message ?? "Solicitação de currículo enviada com sucesso!")
        });
    } catch (err: any) {
        show({
            message: err.message || "Ocorreu um erro ao enviar a solicitação. Tente novamente mais tarde.",
            type: 'error',
        });
    }
})
</script>

<template>
    <AppTitle title="Gerar Currículo Personalizado"
        subtitle="Crie um currículo estratégico com base em uma vaga específica." />

    <form class="space-y-10" @submit.prevent="generateResume">
        <div class="space-y-4">
            <div class="grid md:grid-cols-2 gap-4">
                <SelectField label="Idioma do currículo" name="language">
                    <option value="PT">Português</option>
                    <option value="EN">Inglês</option>
                </SelectField>

                <SelectField label="Tipo de template" name="templateType">
                    <option v-for="type in templateTypes" :key="type" :value="type">
                        {{ capitalizeFirst(type) }}
                    </option>
                </SelectField>
            </div>

            <div class="grid md:grid-cols-3 gap-4">
                <SelectField label="Nível de senioridade" name="seniority">
                    <option value="Junior">Júnior</option>
                    <option value="Mid-level">Pleno</option>
                    <option value="Senior">Sênior</option>
                </SelectField>

                <SelectField label="Área principal de atuação" name="focusArea">
                    <option value="Backend">Backend</option>
                    <option value="Fullstack">Full Stack</option>
                    <option value="Microservices">Microsserviços</option>
                    <option value="DevOps">DevOps</option>
                </SelectField>

                <SelectField label="Mercado de destino" name="market">
                    <option value="Brazil">Brasil</option>
                    <option value="US">Estados Unidos</option>
                    <option value="Europe">Europa</option>
                </SelectField>
            </div>

            <div class="space-y-4">
                <TextAreaField label="Descrição completa da vaga" name="jobText" :rows="10"
                    placeholder="Cole aqui a descrição completa da vaga. Quanto mais detalhes, melhor será a personalização do currículo." />

                <BaseButton type="submit" :disabled="loading" :loading="loading">
                    Gerar currículo personalizado
                </BaseButton>
            </div>
        </div>
    </form>
</template>
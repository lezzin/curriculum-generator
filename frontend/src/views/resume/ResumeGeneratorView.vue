<script setup lang="ts">
import { computed, reactive } from "vue"
import { useApi } from "../../composables/useApi"
import { useResumeValidation } from "../../composables/useResumeValidation"
import BaseButton from "../../components/ui/BaseButton.vue"
import TextAreaField from "../../components/ui/form/TextAreaField.vue"
import SelectField from "../../components/ui/form/SelectField.vue"
import AppTitle from "../../components/layout/AppTitle.vue"
import { useToast } from "../../composables/useToast"

const BASE_TEMPLATE_TYPES = {
    DEFAULT: 'default',
    CLASSIC: 'classic',
    CONDENSED: 'condensed',
} as const

type BaseTemplateType = typeof BASE_TEMPLATE_TYPES[keyof typeof BASE_TEMPLATE_TYPES]

const { show } = useToast()

const state = reactive({
    jobText: "",
    language: "PT",
    seniority: "Junior",
    focusArea: "Backend",
    market: "Brazil",
    templateType: BASE_TEMPLATE_TYPES.DEFAULT as BaseTemplateType,
})

const { api, error, loading: isSendingRequest, request } = useApi()
const { errors, validateJobText, isFormValid } = useResumeValidation(state)

const templateTypes = computed(() => Object.values(BASE_TEMPLATE_TYPES))

async function generateResume() {
    if (!validateJobText()) return

    try {
        await request(async () => {
            const response = await api.post("/resume/generate", {
                jobDescription: state.jobText,
                options: {
                    language: state.language,
                    targetSeniority: state.seniority,
                    focusArea: state.focusArea,
                    market: state.market,
                    template: state.templateType
                }
            })

            show(response.data.message ?? "Solicitação de currículo enviada com sucesso!")
            state.jobText = ""
        });
    } catch (err: any) {
        show({
            message: err.message || "Ocorreu um erro ao enviar a solicitação. Tente novamente mais tarde.",
            type: 'error',
        });
    }
}
</script>

<template>
    <AppTitle title="Gerar Currículo Personalizado"
        subtitle="Crie um currículo estratégico com base em uma vaga específica." />

    <div class="grid md:grid-cols-2 gap-4">
        <SelectField label="Idioma do currículo" v-model="state.language" :error="errors.language">
            <option value="" disabled>Selecione o idioma</option>
            <option value="PT">Português</option>
            <option value="EN">Inglês</option>
        </SelectField>

        <SelectField label="Tipo de template" v-model="state.templateType" :error="errors.templateType">
            <option disabled value="">Selecione uma opção</option>
            <option v-for="type in templateTypes" :key="type" :value="type">
                {{ type.toUpperCase() }}
            </option>
        </SelectField>
    </div>

    <div class="grid md:grid-cols-3 gap-4">
        <SelectField label="Nível de senioridade" v-model="state.seniority" :error="errors.seniority">
            <option value="" disabled>Selecione o nível</option>
            <option value="Junior">Júnior</option>
            <option value="Mid-level">Pleno</option>
            <option value="Senior">Sênior</option>
        </SelectField>

        <SelectField label="Área principal de atuação" v-model="state.focusArea" :error="errors.focusArea">
            <option value="" disabled>Selecione a área</option>
            <option value="Backend">Backend</option>
            <option value="Fullstack">Full Stack</option>
            <option value="Microservices">Microsserviços</option>
            <option value="DevOps">DevOps</option>
        </SelectField>

        <SelectField label="Mercado de destino" v-model="state.market" :error="errors.market">
            <option value="" disabled>Selecione o mercado</option>
            <option value="Brazil">Brasil</option>
            <option value="US">Estados Unidos</option>
            <option value="Europe">Europa</option>
        </SelectField>
    </div>

    <div class="space-y-4">
        <TextAreaField label="Descrição completa da vaga" v-model="state.jobText" :rows="10"
            placeholder="Cole aqui a descrição completa da vaga. Quanto mais detalhes, melhor será a personalização do currículo."
            :error="errors.jobText" />

        <BaseButton @click="generateResume" :disabled="!isFormValid || isSendingRequest" :loading="isSendingRequest">
            Gerar currículo personalizado
        </BaseButton>

        <p v-if="error" class="text-red-500 text-sm">
            {{ error }}
        </p>
    </div>
</template>
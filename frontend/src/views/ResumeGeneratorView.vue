<script setup lang="ts">
import { reactive, watch } from "vue"
import { useApi } from "../composables/useApi"
import { useResumeValidation } from "../composables/useResumeValidation"
import BaseButton from "../components/ui/BaseButton.vue"
import TextAreaField from "../components/ui/form/TextAreaField.vue"
import SelectField from "../components/ui/form/SelectField.vue"
import AppTitle from "../components/layout/AppTitle.vue"
import { useToast } from "../composables/useToast"

const { show } = useToast()

const state = reactive({
    jobText: "",
    language: "EN",
    seniority: "Junior",
    focusArea: "Backend",
    market: "US"
})

const { api, error, loading: isGeneratingResume, request } = useApi()
const { errors, validateJobText, validateRequired, isFormValid } = useResumeValidation(state)

async function generateResume() {
    if (!validateJobText()) return

    await request(async () => {
        await api.post("/resume/generate", {
            jobDescription: state.jobText,
            options: {
                language: state.language,
                targetSeniority: state.seniority,
                focusArea: state.focusArea,
                market: state.market
            }
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

watch(() => state.jobText, validateJobText)
watch(() => state.language, v => validateRequired("language", v))
watch(() => state.seniority, v => validateRequired("seniority", v))
watch(() => state.focusArea, v => validateRequired("focusArea", v))
watch(() => state.market, v => validateRequired("market", v))
</script>

<template>
    <AppTitle title="Gerar currículo" />

    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <SelectField label="Idioma" v-model="state.language" :error="errors.language">
            <option value="">Selecione</option>
            <option value="EN">English</option>
            <option value="PT">Português</option>
        </SelectField>

        <SelectField label="Senioridade" v-model="state.seniority" :error="errors.seniority">
            <option value="">Selecione</option>
            <option value="Junior">Junior</option>
            <option value="Mid-level">Mid-level</option>
        </SelectField>

        <SelectField label="Área de Foco" v-model="state.focusArea" :error="errors.focusArea">
            <option value="">Selecione</option>
            <option value="Backend">Backend</option>
            <option value="Fullstack">Fullstack</option>
            <option value="Microservices">Microservices</option>
            <option value="DevOps">DevOps</option>
        </SelectField>

        <SelectField label="Mercado" v-model="state.market" :error="errors.market">
            <option value="">Selecione</option>
            <option value="US">US</option>
            <option value="Europe">Europe</option>
            <option value="Brazil">Brazil</option>
        </SelectField>
    </div>

    <div class="space-y-4 mt-6">
        <TextAreaField label="Descrição da vaga" v-model="state.jobText" :rows="10"
            placeholder="Cole a descrição da vaga..." :error="errors.jobText" />

        <BaseButton @click="generateResume" :disabled="!isFormValid || isGeneratingResume"
            :loading="isGeneratingResume">
            Gerar Currículo
        </BaseButton>

        <p v-if="error" class="text-red-500 text-sm">
            {{ error }}
        </p>
    </div>
</template>
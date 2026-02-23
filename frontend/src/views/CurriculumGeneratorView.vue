<script setup lang="ts">
import { reactive, computed, watch, ref, onMounted } from "vue"
import type { Resume } from "../interfaces/resume.interfaces"
import { useApi } from "../composables/useApi"
import { usePdf } from "../composables/usePdf"
import { useResumeValidation } from "../composables/useResumeValidation"
import BaseButton from "../components/ui/BaseButton.vue"
import TextAreaField from "../components/ui/form/TextAreaField.vue"
import SelectField from "../components/ui/form/SelectField.vue"
import ResumePreview from "../components/resume/ResumePreview.vue"
import AppTitle from "../components/layout/AppTitle.vue"

const state = reactive({
    jobText: "",
    resume: null as Resume | null,
    language: "EN",
    seniority: "Junior",
    focusArea: "Backend",
    market: "US"
})

const resumesList = ref([] as Resume[])

const { api, error, loading: isGeneratingResume, request } = useApi()
const { pdfUrl, isGenerating: isGeneratingPdf, generatePdf } = usePdf(api)
const { errors, validateJobText, validateRequired, isFormValid } = useResumeValidation(state)

const canViewPdf = computed(() => !!state.resume && !!pdfUrl.value && !isGeneratingPdf.value)

async function generateResume() {
    if (!validateJobText()) return

    const data = await request(async () => {
        const response = await api.post("/resume/generate", {
            jobDescription: state.jobText,
            options: {
                language: state.language,
                targetSeniority: state.seniority,
                focusArea: state.focusArea,
                market: state.market
            }
        })

        return response.data as Resume
    })

    if (!data) return

    state.resume = data
    await generatePdf(state.resume)
}

async function getResumes() {
    const data = await request(async () => {
        const response = await api.get("/resume/all")
        return response.data as Resume[]
    })

    if (!data) return
    resumesList.value = data
}

watch(() => state.jobText, validateJobText)
watch(() => state.language, v => validateRequired("language", v))
watch(() => state.seniority, v => validateRequired("seniority", v))
watch(() => state.focusArea, v => validateRequired("focusArea", v))
watch(() => state.market, v => validateRequired("market", v))

onMounted(() => {
    getResumes()
})
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

        <div class="flex gap-4">
            <BaseButton @click="generateResume" :disabled="!isFormValid || isGeneratingResume"
                :loading="isGeneratingResume">
                Gerar Currículo
            </BaseButton>

            <BaseButton as="a" :href="canViewPdf ? pdfUrl ?? '#' : '#'" target="_blank" variant="outline"
                :disabled="!canViewPdf" :loading="isGeneratingPdf">
                {{ isGeneratingPdf ? "Gerando PDF..." : "Visualizar PDF" }}
            </BaseButton>
        </div>

        <p v-if="error" class="text-red-500 text-sm">
            {{ error }}
        </p>
    </div>

    <div v-if="resumesList.length" class="mt-10">
        <h2 class="text-xl font-semibold mb-4">Currículos Gerados</h2>

        <div class="grid gap-4">
            <ResumePreview v-for="resume in resumesList" :key="resume.id" :resume="resume" />
        </div>
    </div>
</template>
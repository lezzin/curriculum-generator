<script setup lang="ts">
import { reactive, computed, watch } from "vue"
import axios from "axios"
import type { FocusArea, Language, Market, Resume, Seniority } from "../interfaces/resume.interfaces"
import { config } from "../config/variables.config"
import { extractErrorMessage } from "../helper/error.helper"
import SelectField from "../components/ui/form/SelectField.vue"
import BaseButton from "../components/ui/BaseButton.vue"
import AppTitle from "../components/layout/AppTitle.vue"
import TextAreaField from "../components/ui/form/TextAreaField.vue"
import { DESCRIPTION_LENGTH } from "../constants/app.constants"
import { onMounted } from "vue"
import ResumePreview from "../components/resume/ResumePreview.vue"

const state = reactive({
    jobText: "",
    resume: null as Resume | null,
    error: "",
    language: "EN" as Language,
    seniority: "Junior" as Seniority,
    focusArea: "Backend" as FocusArea,
    market: "US" as Market,
    isGeneratingResume: false,
    isGeneratingPdf: false,
    pdfUrl: ""
})

const errors = reactive({
    jobText: "",
    language: "",
    seniority: "",
    focusArea: "",
    market: ""
})

function validateJobText() {
    if (!state.jobText.trim()) {
        errors.jobText = "A descrição da vaga é obrigatória."
        return false
    }

    if (state.jobText.trim().length < DESCRIPTION_LENGTH.min) {
        errors.jobText = `A descrição precisa ter pelo menos ${DESCRIPTION_LENGTH.min} caracteres.`
        return false
    }

    if (state.jobText.trim().length > DESCRIPTION_LENGTH.max) {
        errors.jobText = `A descrição precisa ter até no máximo ${DESCRIPTION_LENGTH.max} caracteres.`
        return false
    }

    errors.jobText = ""
    return true
}

function validateSelect(field: keyof typeof errors, value: string) {
    if (!value) {
        errors[field] = "Campo obrigatório."
        return false
    }

    errors[field] = ""
    return true
}

function validateForm() {
    const isValid =
        validateJobText() &&
        validateSelect("language", state.language) &&
        validateSelect("seniority", state.seniority) &&
        validateSelect("focusArea", state.focusArea) &&
        validateSelect("market", state.market)

    return isValid
}

const isFormValid = computed(() =>
    state.jobText.trim().length >= DESCRIPTION_LENGTH.min &&
    state.jobText.trim().length <= DESCRIPTION_LENGTH.max &&
    state.language &&
    state.seniority &&
    state.focusArea &&
    state.market
)

const api = axios.create({
    baseURL: config.apiUrl
})

async function handleRequest<T>(
    request: () => Promise<T>,
    loadingKey: "isGeneratingResume" | "isGeneratingPdf" | null = null
) {
    try {
        if (loadingKey) state[loadingKey] = true
        state.error = ""
        return await request()
    } catch (err) {
        console.error(err)
        state.error = extractErrorMessage(err)
    } finally {
        if (loadingKey) state[loadingKey] = false
    }
}

async function generateResume() {
    if (!validateForm()) return

    const data = await handleRequest(async () => {
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
    }, "isGeneratingResume")

    if (!data) return

    state.resume = data
    await generatePdf()
}

async function generatePdf() {
    if (!state.resume) return

    const blob = await handleRequest(async () => {
        const response = await api.post(
            "/resume/pdf/generate",
            state.resume,
            { responseType: "blob" }
        )

        return response.data as Blob
    }, "isGeneratingPdf")

    if (!blob) return

    state.pdfUrl = URL.createObjectURL(blob)
}

const resumes = reactive([] as Resume[])

async function getResumes() {
    await handleRequest(async () => {
        const response = await api.get("/resume/all")
        resumes.splice(0, resumes.length, ...response.data as Resume[])
    })
}

const canViewPdf = computed(() => !!state.resume && !!state.pdfUrl && !state.isGeneratingPdf)

watch(() => state.jobText, validateJobText)
watch(() => state.language, value => validateSelect("language", value))
watch(() => state.seniority, value => validateSelect("seniority", value))
watch(() => state.focusArea, value => validateSelect("focusArea", value))
watch(() => state.market, value => validateSelect("market", value))

watch(
    () => state.resume,
    () => {
        if (state.pdfUrl) {
            URL.revokeObjectURL(state.pdfUrl)
            state.pdfUrl = ""
        }
    }
)

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
            <BaseButton @click="generateResume" :disabled="!isFormValid || state.isGeneratingResume"
                :loading="state.isGeneratingResume">
                Gerar Currículo
            </BaseButton>

            <BaseButton as="a" :href="canViewPdf ? state.pdfUrl : undefined" target="_blank" variant="outline"
                :disabled="!canViewPdf" :loading="state.isGeneratingPdf">
                {{ state.isGeneratingPdf ? "Gerando PDF..." : "Visualizar PDF" }}
            </BaseButton>
        </div>

        <p v-if="state.error" class="text-red-500 text-sm">
            {{ state.error }}
        </p>
    </div>

    <div>
        <h2 class="text-xl font-semibold mt-10 mb-4">Currículos Gerados</h2>
        <ResumePreview v-for="resume in resumes" :key="resume.name" :resume="resume" />
    </div>
</template>
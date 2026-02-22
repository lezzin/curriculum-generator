<script setup lang="ts">
import { reactive, computed, watch, onMounted } from "vue"
import axios from "axios"
import type { FocusArea, Language, Market, Resume, Seniority } from "../interfaces/resume.interfaces"
import { config } from "../config/variables.config"
import SelectField from "./SelectField.vue"
import { extractErrorMessage } from "../helper/error.helper"
import BaseButton from "./BaseButton.vue"

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

const canViewPdf = computed(() => !!state.resume && !!state.pdfUrl && !state.isGeneratingPdf)

const api = axios.create({
    baseURL: config.apiUrl
})

async function handleRequest<T>(
    request: () => Promise<T>,
    loadingKey: "isGeneratingResume" | "isGeneratingPdf"
) {
    try {
        state[loadingKey] = true
        state.error = ""
        return await request()
    } catch (err) {
        console.error(err)
        state.error = extractErrorMessage(err);
    } finally {
        state[loadingKey] = false
    }
}

async function generateResume() {
    const data = await handleRequest(async () => {
        const response = await api.post("/gemini/generate-resume", {
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
            "/gemini/generate-pdf",
            state.resume,
            { responseType: "blob" }
        )

        return response.data as Blob
    }, "isGeneratingPdf")

    if (!blob) return

    state.pdfUrl = URL.createObjectURL(blob)
}

watch(
    () => state.resume,
    () => {
        if (state.pdfUrl) {
            URL.revokeObjectURL(state.pdfUrl)
            state.pdfUrl = ""
        }
    }
)

onMounted(() => generatePdf())
</script>
<template>
    <div class="max-w-5xl mx-auto p-8 space-y-8">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <SelectField label="Idioma" v-model="state.language">
                <option value="EN">English</option>
                <option value="PT">Português</option>
            </SelectField>

            <SelectField label="Senioridade" v-model="state.seniority">
                <option value="Junior">Junior</option>
                <option value="Mid-level">Mid-level</option>
            </SelectField>

            <SelectField label="Área de Foco" v-model="state.focusArea">
                <option value="Backend">Backend</option>
                <option value="Fullstack">Fullstack</option>
                <option value="Microservices">Microservices</option>
                <option value="DevOps">DevOps</option>
            </SelectField>

            <SelectField label="Mercado" v-model="state.market">
                <option value="US">US</option>
                <option value="Europe">Europe</option>
                <option value="Brazil">Brazil</option>
            </SelectField>
        </div>

        <div class="space-y-4">
            <div class="flex flex-col gap-1">
                <label class="text-sm font-medium">Descrição da vaga</label>
                <textarea v-model="state.jobText" rows="10" placeholder="Cole a descrição da vaga..."
                    class="w-full p-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-black resize-none" />
            </div>

            <div class="flex gap-4">
                <BaseButton @click="generateResume" :disabled="state.isGeneratingResume"
                    :loading="state.isGeneratingResume">
                    {{ state.isGeneratingResume ? "Gerando currículo..." : "Gerar Currículo" }}
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
    </div>
</template>
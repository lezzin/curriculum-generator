<script setup lang="ts">
import { ref } from "vue"
import axios from "axios"
import ResumePreview from "./ResumePreview.vue"
import type { Resume } from "../interfaces/resume.interfaces"
import { config } from "../config/variables.config"

const jobText = ref("")
const resume = ref<Resume | null>(null)
const error = ref("")

const language = ref<"PT" | "EN">("EN")
const seniority = ref<"Junior" | "Mid-level">("Junior")
const focusArea = ref<"Backend" | "Fullstack" | "Microservices" | "DevOps">("Backend")
const market = ref<"Brazil" | "US" | "Europe">("US")

const isGeneratingResume = ref(false)
const isGeneratingPdf = ref(false)

const generateResume = async () => {
    try {
        isGeneratingResume.value = true

        const { data } = await axios.post(
            `${config.apiUrl}/gemini/generate-resume`,
            {
                jobDescription: jobText.value,
                options: {
                    language: language.value,
                    targetSeniority: seniority.value,
                    focusArea: focusArea.value,
                    market: market.value
                }
            }
        )

        resume.value = data
    } catch (error) {
        console.error(error)
    } finally {
        isGeneratingResume.value = false
    }
}

const downloadPDF = async () => {
    if (!resume.value) return

    try {
        isGeneratingPdf.value = true

        const response = await axios.post(
            `${config.apiUrl}/gemini/generate-pdf`,
            resume.value,
            { responseType: "blob" }
        )

        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement("a")
        link.href = url
        link.setAttribute("download", "resume.pdf")
        document.body.appendChild(link)
        link.click()
    } catch (error) {
        console.error(error)
    } finally {
        isGeneratingPdf.value = false
    }
}
</script>

<template>
    <div class="max-w-5xl mx-auto p-8 space-y-8">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">

            <div class="flex flex-col gap-1">
                <label class="text-sm font-medium">Idioma</label>
                <select v-model="language" class="p-2 border rounded-lg">
                    <option value="EN">English</option>
                    <option value="PT">Português</option>
                </select>
            </div>

            <div class="flex flex-col gap-1">
                <label class="text-sm font-medium">Senioridade</label>
                <select v-model="seniority" class="p-2 border rounded-lg">
                    <option value="Junior">Junior</option>
                    <option value="Mid-level">Mid-level</option>
                </select>
            </div>

            <div class="flex flex-col gap-1">
                <label class="text-sm font-medium">Área de Foco</label>
                <select v-model="focusArea" class="p-2 border rounded-lg">
                    <option value="Backend">Backend</option>
                    <option value="Fullstack">Fullstack</option>
                    <option value="Microservices">Microservices</option>
                    <option value="DevOps">DevOps</option>
                </select>
            </div>

            <div class="flex flex-col gap-1">
                <label class="text-sm font-medium">Mercado</label>
                <select v-model="market" class="p-2 border rounded-lg">
                    <option value="US">US</option>
                    <option value="Europe">Europe</option>
                    <option value="Brazil">Brazil</option>
                </select>
            </div>

        </div>

        <div class="space-y-4">
            <div class="flex flex-col gap-1">
                <label class="text-sm font-medium">Descrição da vaga</label>
                <textarea v-model="jobText" rows="10" placeholder="Cole a descrição da vaga..."
                    class="w-full p-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-black resize-none" />
            </div>

            <div class="flex gap-4">
                <button @click="generateResume" :disabled="isGeneratingResume"
                    class="px-4 py-2 bg-black text-white rounded flex items-center gap-2 disabled:opacity-50">
                    <span v-if="isGeneratingResume" class="loader"></span>
                    {{ isGeneratingResume ? "Gerando currículo..." : "Gerar Currículo" }}
                </button>

                <button @click="downloadPDF" :disabled="isGeneratingPdf || !resume"
                    class="px-4 py-2 bg-gray-800 text-white rounded flex items-center gap-2 disabled:opacity-50">
                    <span v-if="isGeneratingPdf" class="loader"></span>
                    {{ isGeneratingPdf ? "Gerando PDF..." : "Gerar PDF" }}
                </button>
            </div>

            <p v-if="error" class="text-red-500 text-sm">
                {{ error }}
            </p>
        </div>

        <ResumePreview v-if="resume" :resume="resume" />
    </div>
</template>

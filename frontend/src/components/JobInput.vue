<script setup lang="ts">
import { ref } from "vue"
import axios from "axios"
import ResumePreview from "./ResumePreview.vue"
import type { Resume } from "../interfaces/resume.interfaces"

const jobText = ref("")
const resume = ref<Resume | null>(null)
const loading = ref(false)
const error = ref("")

const language = ref<"PT" | "EN">("EN")
const seniority = ref<"Junior" | "Mid-level">("Junior")
const focusArea = ref<"Backend" | "Fullstack" | "Microservices" | "DevOps">("Backend")
const market = ref<"Brazil" | "US" | "Europe">("US")

async function generate() {
    if (!jobText.value.trim()) return

    try {
        loading.value = true
        error.value = ""

        const { data } = await axios.post("http://localhost:3001/gemini/generate-curriculum", {
            jobDescription: jobText.value,
            options: {
                language: language.value,
                targetSeniority: seniority.value,
                focusArea: focusArea.value,
                market: market.value
            }
        })

        resume.value = data
    } catch (err) {
        error.value = "Erro ao gerar currículo."
    } finally {
        loading.value = false
    }
}

function downloadPDF() {
    window.print()
}
</script>

<template>
    <div class="max-w-5xl mx-auto p-8 space-y-8 print:hidden">

        <!-- CONFIGURAÇÕES -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <select v-model="language" class="p-2 border rounded-lg">
                <option value="EN">English</option>
                <option value="PT">Português</option>
            </select>

            <select v-model="seniority" class="p-2 border rounded-lg">
                <option value="Junior">Junior</option>
                <option value="Mid-level">Mid-level</option>
            </select>

            <select v-model="focusArea" class="p-2 border rounded-lg">
                <option value="Backend">Backend</option>
                <option value="Fullstack">Fullstack</option>
                <option value="Microservices">Microservices</option>
                <option value="DevOps">DevOps</option>
            </select>

            <select v-model="market" class="p-2 border rounded-lg">
                <option value="US">US</option>
                <option value="Europe">Europe</option>
                <option value="Brazil">Brazil</option>
            </select>
        </div>

        <!-- JOB DESCRIPTION -->
        <div class="space-y-4">
            <textarea v-model="jobText" rows="10" placeholder="Cole a descrição da vaga..."
                class="w-full p-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-black resize-none" />

            <div class="flex gap-4">
                <button @click="generate" :disabled="loading"
                    class="px-6 py-2 bg-black text-white rounded-xl hover:opacity-80 disabled:opacity-50 transition">
                    {{ loading ? "Gerando..." : "Gerar Currículo com IA" }}
                </button>

                <button v-if="resume" @click="downloadPDF"
                    class="px-6 py-2 border border-black rounded-xl hover:bg-black hover:text-white transition">
                    Baixar PDF
                </button>
            </div>

            <p v-if="error" class="text-red-500 text-sm">
                {{ error }}
            </p>
        </div>
    </div>

    <ResumePreview v-if="resume" :resume="resume" />
</template>

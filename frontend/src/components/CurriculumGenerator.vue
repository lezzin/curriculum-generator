<script setup lang="ts">
import { reactive, computed, watch, onMounted } from "vue"
import axios from "axios"
import type { FocusArea, Language, Market, Resume, Seniority } from "../interfaces/resume.interfaces"
import { config } from "../config/variables.config"
import SelectField from "./SelectField.vue"

const state = reactive({
    jobText: "",
    resume: {
        "name": "Leandro Adrian",
        "language": "PT",
        "role": "Desenvolvedor Backend Júnior",
        "summary": "Desenvolvedor Backend Júnior com experiência na construção de sistemas financeiros escaláveis e de alto desempenho, focado em processamento assíncrono e arquiteturas de microsserviços. Habilidade comprovada na otimização de performance, resultando em melhorias de até 97.5% no tempo de processamento de relatórios e na gestão de mais de 100 mil faturas diárias. Experiência em metodologias ágeis e práticas de CI/CD para entrega contínua de software.",
        "skills": [
            "PHP",
            "Laravel",
            "NestJS",
            "Node.js",
            "TypeScript",
            "PostgreSQL",
            "MySQL",
            "RabbitMQ",
            "Redis",
            "Docker",
            "Kubernetes (Pods, Services, CronJobs)",
            "MinIO (Object Storage)",
            "Git",
            "Linux (Ubuntu)",
            "Microserviços",
            "Arquitetura Orientada a Eventos",
            "APIs REST",
            "Processamento Assíncrono",
            "Otimização de Performance",
            "Otimização de Consultas SQL",
            "Sistemas Distribuídos",
            "CI/CD",
            "Metodologias Ágeis"
        ],
        "experiences": [
            {
                "title": "Desenvolvedor Backend Trainee",
                "company": "Ágil Empréstimos",
                "period": "Abr 2025 - Presente",
                "responsibilities": [
                    "Projetei e escalei um sistema de processamento assíncrono de faturas, gerenciando mais de 100 mil faturas diárias em um ambiente financeiro de alto volume.",
                    "Migrei a geração síncrona de relatórios para uma arquitetura baseada em filas, reduzindo o tempo de processamento de 40 minutos para menos de 1 minuto (melhoria de 97.5%).",
                    "Refatorei um microsserviço de WhatsApp utilizando NestJS e TypeScript, permitindo a gestão de templates por equipes não técnicas e aprimorando a comunicação.",
                    "Desenvolvi e mantive sistemas legados, implementando melhorias contínuas para assegurar estabilidade e otimização de performance.",
                    "Colaborei no ciclo de vida de desenvolvimento de software em um ambiente de metodologias ágeis, aplicando práticas de CI/CD."
                ],
                "technologies": [
                    "Laravel",
                    "NestJS",
                    "RabbitMQ",
                    "Redis",
                    "PostgreSQL",
                    "MinIO",
                    "Docker",
                    "Node.js",
                    "TypeScript"
                ]
            }
        ],
        "projects": [
            {
                "name": "Sistema de Despacho de Faturas Assíncrono",
                "highlights": [
                    "Desenvolvi uma arquitetura de processamento assíncrono baseada em filas, capaz de gerenciar mais de 100 mil faturas/dia.",
                    "Utilizei Laravel para o desenvolvimento da aplicação principal e RabbitMQ para a orquestração de mensagens e filas.",
                    "Integrei Redis para cache e otimização do throughput, assegurando resiliência em picos de volume.",
                    "Implementei o armazenamento de objetos com MinIO, garantindo a persistência segura dos dados das faturas."
                ],
                "technologies": [
                    "Laravel",
                    "RabbitMQ",
                    "Redis",
                    "MinIO"
                ]
            },
            {
                "name": "API de Processamento Assíncrono de Relatórios",
                "highlights": [
                    "Otimizei a geração de relatórios, migrando um processo síncrono de 40 minutos para um modelo assíncrono em menos de 1 minuto (ganho de 97.5%).",
                    "Utilizei filas Redis para gerenciar o processamento de relatórios e Laravel para a construção da API, garantindo alta performance.",
                    "Implementei a geração de arquivos via streaming e o armazenamento em MinIO, melhorando a escalabilidade e a eficiência."
                ],
                "technologies": [
                    "Laravel",
                    "Redis",
                    "MinIO"
                ]
            },
            {
                "name": "Refatoração de Microsserviço de WhatsApp",
                "highlights": [
                    "Conduzi a refatoração de um microsserviço crítico usando NestJS e TypeScript, aprimorando a modularidade e a manutenção.",
                    "Desenvolvi integrações com APIs externas para envio de mensagens e gerenciei filas com Redis para processamento eficiente.",
                    "Possibilitei que equipes não técnicas gerenciassem templates de mensagens, agilizando campanhas de comunicação e reduzindo a dependência técnica."
                ],
                "technologies": [
                    "NestJS",
                    "TypeScript",
                    "Redis"
                ]
            }
        ]
    } as Resume | null,
    error: "",
    language: "EN" as Language,
    seniority: "Junior" as Seniority,
    focusArea: "Backend" as FocusArea,
    market: "US" as Market,
    isGeneratingResume: false,
    isGeneratingPdf: false,
    pdfUrl: ""
})

const canGeneratePdf = computed(() => !!state.resume && !!state.pdfUrl)

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
        state.error = "Ocorreu um erro. Tente novamente."
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
                <button @click="generateResume" :disabled="state.isGeneratingResume"
                    class="px-4 py-2 bg-black text-white rounded flex items-center gap-2 disabled:opacity-50">
                    <span v-if="state.isGeneratingResume" class="loader"></span>
                    {{ state.isGeneratingResume ? "Gerando currículo..." : "Gerar Currículo" }}
                </button>

                <a v-if="canGeneratePdf" :href="state.pdfUrl" target="_blank"
                    class="px-4 py-2 bg-gray-800 text-white rounded flex items-center gap-2">
                    <span v-if="state.isGeneratingPdf" class="loader"></span>
                    {{ state.isGeneratingPdf ? "Gerando PDF..." : "Visualizar PDF" }}
                </a>
            </div>

            <p v-if="state.error" class="text-red-500 text-sm">
                {{ state.error }}
            </p>
        </div>
    </div>
</template>
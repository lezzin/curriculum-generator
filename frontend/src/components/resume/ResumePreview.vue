<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue"
import type { Resume } from "../../interfaces/resume.interfaces"
import axios from "axios";
import { config } from "../../config/variables.config";
import BaseButton from "../ui/BaseButton.vue";

const props = defineProps<{
    resume: Resume
}>()

const isOpen = ref(false)
const pdfUrl = ref("")

const api = axios.create({
    baseURL: config.apiUrl
})

const shortSummary = computed(() => {
    if (!props.resume.summary) return ""

    return props.resume.summary.length > 120
        ? props.resume.summary.slice(0, 120) + "..."
        : props.resume.summary
})

async function generatePdf() {
    if (!props.resume) return

    const response = await api.post(
        "/resume/pdf/generate",
        props.resume,
        { responseType: "blob" }
    )

    const blob = response.data as Blob
    if (!blob) return

    pdfUrl.value = URL.createObjectURL(blob)
}

watch(() => props.resume, () => {
    if (pdfUrl.value) {
        URL.revokeObjectURL(pdfUrl.value)
        pdfUrl.value = ""
    }
})

onMounted(() => {
    console.log(props.resume);

    if (props.resume) {
        generatePdf()
    }
})
</script>

<template>
    <div class="border rounded-xl p-4 shadow-sm hover:shadow-md transition cursor-pointer bg-white">
        <div class="flex justify-between items-start" @click="isOpen = !isOpen">
            <div>
                <h3 class="text-lg font-semibold">
                    {{ resume.name }}
                </h3>

                <p class="text-sm text-gray-500">
                    {{ resume.role }} • {{ resume.language }}
                </p>
            </div>

            <div class="flex items-center gap-4">
                <span class="text-sm text-blue-600 font-medium">
                    {{ isOpen ? "Fechar" : "Ver detalhes" }}
                </span>

                <BaseButton v-if="pdfUrl" :href="pdfUrl" as="a" target="_blank" size="sm">
                    Ver PDF
                </BaseButton>
            </div>
        </div>

        <p class="mt-3 text-sm text-gray-700">
            {{ isOpen ? resume.summary : shortSummary }}
        </p>

        <transition name="fade">
            <div v-if="isOpen" class="mt-4 space-y-4">
                <div>
                    <h4 class="font-medium text-sm mb-2">Skills</h4>
                    <div class="flex flex-wrap gap-2">
                        <span v-for="skill in resume.skills" :key="skill" class="text-xs bg-gray-100 px-2 py-1 rounded">
                            {{ skill }}
                        </span>
                    </div>
                </div>

                <div v-if="resume.experiences?.length">
                    <h4 class="font-medium text-sm mb-2">Experiências</h4>

                    <div v-for="exp in resume.experiences" :key="exp.title + exp.company"
                        class="mb-3 border-l-2 border-gray-200 pl-3">
                        <p class="font-medium text-sm">
                            {{ exp.title }} - {{ exp.company }}
                        </p>
                        <p class="text-xs text-gray-500">{{ exp.period }}</p>

                        <ul class="list-disc ml-4 mt-1 text-sm text-gray-700">
                            <li v-for="resp in exp.responsibilities.slice(0, 3)" :key="resp">
                                {{ resp }}
                            </li>
                        </ul>
                    </div>
                </div>

                <div v-if="resume.projects?.length">
                    <h4 class="font-medium text-sm mb-2">Projetos</h4>

                    <div v-for="project in resume.projects" :key="project.name" class="mb-2">
                        <p class="font-medium text-sm">{{ project.name }}</p>

                        <div class="flex flex-wrap gap-2 mt-1">
                            <span v-for="tech in project.technologies" :key="tech"
                                class="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                                {{ tech }}
                            </span>
                        </div>

                        <ul class="list-disc ml-4 mt-1 text-sm text-gray-700">
                            <li v-for="highlight in project.highlights.slice(0, 3)" :key="highlight">
                                {{ highlight }}
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: all 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
    transform: translateY(-5px);
}
</style>
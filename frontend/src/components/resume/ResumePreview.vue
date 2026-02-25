<script setup lang="ts">
import { ref, computed } from "vue"
import { usePdf } from "../../composables/usePdf"
import type { Resume } from "../../interfaces/resume.interfaces"
import BaseButton from "../ui/BaseButton.vue"
import { toHumanReadableDate } from "../../helper/string.helper"

const props = defineProps<{ resume: Resume }>()

const isOpen = ref(false)
const resume = computed(() => props.resume)

const { getPublicPdfUrl } = usePdf()

function togglePrompt() {
    isOpen.value = !isOpen.value
}

const shortPrompt = computed(() => {
    const prompt = resume.value.prompt ?? ""
    return prompt.length > 120 ? prompt.slice(0, 120) + "..." : prompt
})

const goToPdfUrl = async () => {
    const pdfUrl = await getPublicPdfUrl(resume.value.id!);
    window.open(pdfUrl, "_blank");
};
</script>

<template>
    <div
        class="group border rounded-2xl px-5 pb-5 bg-white shadow-sm hover:shadow-md transition-all duration-200 relative">
        <div class="sticky py-4 top-12 bg-white flex justify-between items-center cursor-pointer gap-4"
            @click="isOpen = !isOpen">
            <small class="text-gray-500">Criado em: {{ toHumanReadableDate(resume.createdAt ?? "") }}</small>

            <div class="flex items-center gap-3">
                <svg class="w-4 h-4 text-gray-400 transition-transform duration-200" :class="{ 'rotate-180': isOpen }"
                    fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                </svg>

                <BaseButton v-if="resume.id" @click.stop="goToPdfUrl" size="sm" variant="outline">
                    PDF
                </BaseButton>
            </div>
        </div>

        <div class="w-full text-sm leading-relaxed rounded-xl p-4
                       bg-zinc-50 text-zinc-700 border border-zinc-200
                       cursor-pointer whitespace-pre-wrap
                       hover:bg-zinc-100 transition-colors" @click="togglePrompt">
            {{ isOpen ? resume.prompt : shortPrompt }}
        </div>

        <div v-if="isOpen" class="mt-4 pt-4">
            <h3 class="text-lg font-semibold text-gray-900">
                {{ resume.name }}
            </h3>

            <div class="flex items-center gap-2 text-sm text-gray-500">
                <span>{{ resume.role }}</span>

                <span class="text-gray-300">•</span>

                <span class="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-600">
                    {{ resume.language }}
                </span>
            </div>

            <p class="mt-4 text-sm text-gray-700 leading-relaxed">
                {{ resume.summary }}
            </p>

            <transition name="fade">
                <div v-if="isOpen" class="mt-6 space-y-6">
                    <section>
                        <h4 class="text-xs font-semibold tracking-wide text-gray-500 uppercase mb-3">
                            Skills
                        </h4>

                        <div class="flex flex-wrap gap-2">
                            <span v-for="skill in resume.skills" :key="skill"
                                class="text-xs bg-gray-100 text-gray-700 px-2.5 py-1 rounded-md">
                                {{ skill }}
                            </span>
                        </div>
                    </section>

                    <section v-if="resume.experiences?.length">
                        <h4 class="text-xs font-semibold tracking-wide text-gray-500 uppercase mb-4">
                            Experiência
                        </h4>

                        <div class="space-y-4">
                            <div v-for="exp in resume.experiences" :key="exp.title + exp.company"
                                class="border-l-2 border-gray-200 pl-4">
                                <div class="flex justify-between items-start gap-4">
                                    <div>
                                        <p class="text-sm font-medium text-gray-900">
                                            {{ exp.title }}
                                        </p>
                                        <p class="text-sm text-gray-600">
                                            {{ exp.company }}
                                        </p>
                                    </div>

                                    <span class="text-xs text-gray-400 whitespace-nowrap">
                                        {{ exp.period }}
                                    </span>
                                </div>

                                <ul class="list-disc ml-4 mt-2 text-sm text-gray-700 space-y-1">
                                    <li v-for="resp in exp.responsibilities.slice(0, 3)" :key="resp">
                                        {{ resp }}
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    <section v-if="resume.projects?.length">
                        <h4 class="text-xs font-semibold tracking-wide text-gray-500 uppercase mb-4">
                            Projetos
                        </h4>

                        <div class="space-y-4">
                            <div v-for="project in resume.projects" :key="project.name"
                                class="border border-gray-100 rounded-lg p-4 bg-gray-50">
                                <p class="text-sm font-medium text-gray-900">
                                    {{ project.name }}
                                </p>

                                <div class="flex flex-wrap gap-2 mt-2">
                                    <span v-for="tech in project.technologies" :key="tech"
                                        class="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-md">
                                        {{ tech }}
                                    </span>
                                </div>

                                <ul class="list-disc ml-4 mt-3 text-sm text-gray-700 space-y-1">
                                    <li v-for="highlight in project.highlights.slice(0, 3)" :key="highlight">
                                        {{ highlight }}
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </section>
                </div>
            </transition>
        </div>
    </div>
</template>
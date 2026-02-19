<script setup lang="ts">
import type { Resume } from '../interfaces/resume.interfaces';

defineProps<{
    resume: Resume
}>()
</script>

<template>
    <div class="resume-print mx-auto bg-white text-gray-900
                w-[210mm] min-h-[297mm] p-[22mm]
                leading-relaxed text-[14px] font-sans">

        <header class="mb-8 border-b pb-4">
            <h1 class="text-2xl font-semibold tracking-tight">
                {{ resume.name }}
            </h1>

            <p class="text-base text-gray-600 mt-1">
                {{ resume.role }}
            </p>

            <p class="mt-4 text-sm text-gray-700">
                {{ resume.summary }}
            </p>
        </header>

        <section class="mb-8">
            <h2 class="text-xs font-semibold uppercase tracking-widest mb-3 text-gray-500">
                Skills
            </h2>

            <p class="text-sm text-gray-800">
                {{ resume.skills.join(" · ") }}
            </p>
        </section>

        <section>
            <h2 class="text-xs font-semibold uppercase tracking-widest mb-4 text-gray-500">
                Experience
            </h2>

            <div v-for="exp in resume.experiences" :key="exp.title" class="mb-6 break-inside-avoid-page">
                <div class="flex justify-between items-baseline">
                    <h3 class="font-semibold text-sm">
                        {{ exp.title }}
                    </h3>
                    <span class="text-xs text-gray-500">
                        {{ exp.company }} • {{ exp.period }}
                    </span>
                </div>

                <div class="mt-3 text-sm text-gray-800 whitespace-pre-line leading-relaxed space-y-2">
                    <p v-for="line in exp.description.split('\n')" :key="line">
                        {{ line }}
                    </p>
                </div>

                <p class="mt-2 text-xs text-gray-500">
                    {{ exp.technologies.join(' · ') }}
                </p>
            </div>
        </section>

        <section v-if="resume.projects && resume.projects.length" class="mt-10">
            <h2 class="text-xs font-semibold uppercase tracking-widest mb-4 text-gray-500">
                Projects
            </h2>

            <div v-for="project in resume.projects" :key="project.name" class="mb-6 break-inside-avoid-page">
                <h3 class="font-semibold text-sm">
                    {{ project.name }}
                </h3>

                <div class="mt-2 text-sm text-gray-800 whitespace-pre-line leading-relaxed space-y-2">
                    <p v-for="line in project.description.split('\n')" :key="line">
                        {{ line }}
                    </p>
                </div>

                <p class="mt-2 text-xs text-gray-500">
                    {{ project.technologies.join(' · ') }}
                </p>
            </div>
        </section>
    </div>
</template>

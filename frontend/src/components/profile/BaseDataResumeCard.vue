<script setup lang="ts">
import BaseBadge from '../ui/BaseBadge.vue';
import CardContainer from '../ui/card/CardContainer.vue';

interface Experience {
    title: string;
    company: string;
    period: string;
    responsibilities: string[];
    technologies: string[];
}

interface Project {
    name: string;
    highlights: string[];
    technologies: string[];
}

export interface ResumeContent {
    summary: string;
    skills: string[];
    experiences: Experience[];
    projects: Project[];
}

interface Props {
    resume: ResumeContent | null,
    height?: string
}

const props = withDefaults(defineProps<Props>(), {
    height: 'h-80'
});
</script>

<template>
    <CardContainer variant="text" size="sm" class="overflow-y-auto space-y-6" :class="height">
        <template v-if="resume">
            <section>
                <h3 class="font-semibold text-sm mb-1">Descrição</h3>
                <p class="text-sm text-gray-700">
                    {{ resume.summary }}
                </p>
            </section>

            <section v-if="resume.skills.length">
                <h3 class="font-semibold text-sm mb-2">Skills</h3>
                <div class="flex flex-wrap gap-1 pt-1">
                    <BaseBadge v-for="tech in resume.skills" :key="tech" variant="default" :text="tech" />
                </div>
            </section>

            <section v-if="resume.experiences.length">
                <h3 class="font-semibold text-sm mb-2">Experiências</h3>

                <div v-for="experience in resume.experiences" :key="experience.title"
                    class="space-y-2 border-b pb-3 mb-3">
                    <div class="text-sm font-medium">
                        {{ experience.title }} • {{ experience.company }}
                    </div>

                    <div class="text-xs text-gray-500">
                        {{ experience.period }}
                    </div>

                    <ul class="list-disc ml-4 text-xs space-y-1">
                        <li v-for="r in experience.responsibilities" :key="r">
                            {{ r }}
                        </li>
                    </ul>

                    <div class="flex flex-wrap gap-1 pt-1">
                        <BaseBadge v-for="tech in experience.technologies" :key="tech" variant="success" :text="tech" />
                    </div>
                </div>
            </section>

            <section class="grid gap-4" v-if="resume.projects.length">
                <h3 class="font-semibold text-sm">Projetos</h3>

                <div v-for="project in resume.projects" :key="project.name" class="space-y-2">
                    <div class="text-sm font-medium">
                        {{ project.name }}
                    </div>

                    <ul class="list-disc ml-4 text-xs space-y-1">
                        <li v-for="h in project.highlights" :key="h">
                            {{ h }}
                        </li>
                    </ul>

                    <div class="flex flex-wrap gap-1">
                        <BaseBadge v-for="tech in project.technologies" :key="tech" variant="success" :text="tech" />
                    </div>
                </div>
            </section>
        </template>

        <template v-else>
            <div class="text-gray-500 space-y-2 text-sm">
                <p>Você ainda não cadastrou uma base.</p>

                <ul class="list-disc ml-5 text-xs space-y-1">
                    <li>Resumo profissional</li>
                    <li>Principais habilidades</li>
                    <li>Experiências relevantes</li>
                    <li>Diferenciais competitivos</li>
                </ul>
            </div>
        </template>
    </CardContainer>
</template>
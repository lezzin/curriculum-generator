<script setup lang="ts">
import type { ResumeContent } from '../../interfaces/resume.interfaces';
import BaseBadge from '../ui/BaseBadge.vue';
import CardContainer from '../ui/card/CardContainer.vue';

interface Props {
  resume: ResumeContent | null;
  height?: string;
}

const props = withDefaults(defineProps<Props>(), {
  height: 'h-80',
});
</script>

<template>
  <CardContainer variant="text" size="sm" class="overflow-y-auto space-y-6 text-gray-700 dark:text-gray-200"
    :class="height">
    <template v-if="resume">
      <section>
        <h3 class="font-semibold text-sm text-gray-900 dark:text-white mb-1">Descrição</h3>

        <p class="text-sm text-gray-600 dark:text-gray-300">
          {{ resume.summary }}
        </p>
      </section>

      <section v-if="resume.skills.length">
        <h3 class="font-semibold text-sm text-gray-900 dark:text-white mb-1">Skills</h3>

        <div class="flex flex-wrap gap-1 pt-1">
          <BaseBadge v-for="tech in resume.skills" :key="tech" variant="default" :text="tech" />
        </div>
      </section>

      <section v-if="resume.experiences.length">
        <h3 class="font-semibold text-sm text-gray-900 dark:text-white mb-1">Experiências</h3>

        <div v-for="experience in resume.experiences" :key="experience.title"
          class="space-y-2 border-b border-gray-200 dark:border-gray-700 pb-3 mb-3">
          <div class="text-sm font-medium">
            {{ experience.title }} • {{ experience.company }}
          </div>

          <div class="text-xs text-gray-500 dark:text-gray-400">
            {{ experience.period }}
          </div>

          <ul class="list-disc ml-4 text-xs text-gray-600 dark:text-gray-300 space-y-1">
            <li v-for="r in experience.responsibilities" :key="r">
              {{ r }}
            </li>
          </ul>

          <div class="flex flex-wrap gap-1 pt-1">
            <BaseBadge v-for="tech in experience.technologies" :key="tech" variant="success" :text="tech" />
          </div>
        </div>
      </section>

      <section v-if="resume.projects.length" class="grid gap-4">
        <h3 class="font-semibold text-sm text-gray-900 dark:text-white">Projetos</h3>

        <div v-for="project in resume.projects" :key="project.name" class="space-y-2">
          <div class="text-sm font-medium text-gray-800 dark:text-gray-200">
            {{ project.name }}
          </div>

          <ul class="list-disc ml-4 text-xs text-gray-600 dark:text-gray-300 space-y-1">
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
      <div class="text-sm text-gray-600 dark:text-gray-300 space-y-2">
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
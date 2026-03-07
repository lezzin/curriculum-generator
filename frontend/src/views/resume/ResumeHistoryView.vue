<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import { usePaginated } from '../../composables/usePaginated';
import ResumePreview from '../../components/resume/ResumePreview.vue';
import AppTitle from '../../components/layout/AppTitle.vue';
import { useAuthStore } from '../../stores/auth';
import { sseService } from '../../services/sse.service';
import type { Resume } from '../../interfaces/resume.interfaces';
import { api } from '../../services/api/api';
import BasePagination from '../../components/ui/BasePagination.vue';

const authStore = useAuthStore();

const {
  items: resumes,
  hasMore,
  isFetching,
  total,
  fetch,
  remove,
  prepend
} = usePaginated<Resume>(api, '/resume/all', 10);

function handleResumeGenerated(data: Resume) {
  if (data.userId !== authStore.user?.id) return;
  prepend(data, (item) => item.id);
}

onMounted(async () => {
  await fetch((item) => item.id);
  sseService.on('resume-generated', handleResumeGenerated);
});

onUnmounted(() => {
  sseService.off('resume-generated', handleResumeGenerated);
});

function removeFromList(id: string) {
  remove(id, item => item.id);
}
</script>

<template>
  <AppTitle title="Meus Currículos Gerados"
    subtitle="Acompanhe, visualize e gerencie os currículos criados com base nas vagas enviadas." />

  <div v-if="resumes.length" class="grid gap-4">
    <ResumePreview v-for="resume in resumes" :key="resume.id" :resume="resume"
      @remove="() => removeFromList(resume.id)" />

    <BasePagination :items="resumes" :hasMore="hasMore" :isFetching="isFetching"
      :loadMore="() => fetch(item => item.id)" :total="total" />
  </div>

  <div v-else class="text-center space-y-3">
    <p class="text-gray-500">Você ainda não gerou nenhum currículo personalizado.</p>

    <router-link :to="{ name: 'ResumeGenerate' }" class="text-primary font-medium hover:underline">
      Criar meu primeiro currículo
    </router-link>
  </div>
</template>

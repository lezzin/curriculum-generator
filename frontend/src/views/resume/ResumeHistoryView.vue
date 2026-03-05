<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useApi } from '../../composables/api/useApi';
import { sseService } from '../../services/sse.service';
import type { Resume } from '../../interfaces/resume.interfaces';
import ResumePreview from '../../components/resume/ResumePreview.vue';
import AppTitle from '../../components/layout/AppTitle.vue';
import LoadContainer from '../../components/ui/LoadContainer.vue';
import { useToast } from '../../composables/useToast';
import { useAuthStore } from '../../stores/auth';

const { request, loading: isLoading } = useApi();
const authStore = useAuthStore();
const { show } = useToast();

const resumesList = ref<Resume[]>([]);

async function getResumes() {
  const { data, error } = await request<{ items: Resume[] }>('get', '/resume/all');

  if (error) {
    show({ message: error, type: 'error' });
    return;
  }

  resumesList.value = data?.items ?? [];
}

const removeFromList = (resumeId: string) => {
  resumesList.value = resumesList.value.filter((resume) => resume.id !== resumeId);
};

sseService.on<Resume>('resume-generated', (data) => {
  if (data.userId !== authStore.user?.id) return;
  resumesList.value.unshift(data);
});

onMounted(getResumes);
</script>

<template>
  <AppTitle title="Meus Currículos Gerados"
    subtitle="Acompanhe, visualize e gerencie os currículos criados com base nas vagas enviadas." />

  <LoadContainer :loading="isLoading">
    <div class="grid gap-4" v-if="resumesList.length > 0">
      <ResumePreview v-for="resume in resumesList" :key="resume.id" :resume="resume"
        @remove="() => removeFromList(resume.id)" />
    </div>
    <div v-else class="text-center space-y-3">
      <p class="text-gray-500">Você ainda não gerou nenhum currículo personalizado.</p>

      <router-link :to="{ name: 'ResumeGenerate' }" class="text-primary font-medium hover:underline">
        Criar meu primeiro currículo
      </router-link>
    </div>
  </LoadContainer>
</template>

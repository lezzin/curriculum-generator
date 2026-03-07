<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { useApi } from '../../composables/api/useApi';
import { sseService } from '../../services/sse.service';
import type { Resume } from '../../interfaces/resume.interfaces';
import ResumePreview from '../../components/resume/ResumePreview.vue';
import AppTitle from '../../components/layout/AppTitle.vue';
import { useToast } from '../../composables/useToast';
import { useAuthStore } from '../../stores/auth';
import type { PaginatedResult } from '../../interfaces/paginate.interfaces';

const { request } = useApi();
const authStore = useAuthStore();
const { show } = useToast();

const resumesList = ref<Resume[]>([]);

const isFetchingMore = ref(false)
const total = ref(0)
const page = ref(1)

const resumeMap = new Map<string, boolean>()

const hasMore = computed(
  () => total.value > 0 && resumesList.value.length < total.value
)

function addUniqueResumes(list: Resume[]) {
  const newItems: Resume[] = []

  for (const proposal of list) {
    const idStr = String(proposal.id)

    if (!resumeMap.has(idStr)) {
      resumeMap.set(idStr, true)
      newItems.push(proposal)
    }
  }

  resumesList.value.push(...list)
}

async function getResumes() {
  if (isFetchingMore.value) return
  if (!hasMore.value && total.value !== 0) return

  isFetchingMore.value = true

  const { data, error } = await request<PaginatedResult<Resume>>('get', '/resume/all', {
    page: page.value,
    limit: 10
  });

  if (error) {
    show({ message: error, type: 'error' });
    isFetchingMore.value = false
    return;
  }

  if (data) {
    total.value = data.total
    addUniqueResumes(data.data)
    page.value++
  }

  isFetchingMore.value = false
}

function removeFromList(proposalId: string) {
  resumesList.value = resumesList.value.filter(
    (resume) => resume.id !== proposalId
  )

  resumeMap.delete(proposalId)
  total.value--
}

function handleResumeGenerated(data: Resume) {
  if (data.userId !== authStore.user?.id) return

  if (resumeMap.has(data.id)) return
  resumeMap.set(data.id, true)
  resumesList.value.unshift(data)

  total.value++
}

onMounted(async () => {
  await getResumes();

  sseService.on<Resume>(
    'resume-generated',
    handleResumeGenerated
  );
});

onUnmounted(() => {
  sseService.off('resume-generated', handleResumeGenerated);
});
</script>

<template>
  <AppTitle title="Meus Currículos Gerados"
    subtitle="Acompanhe, visualize e gerencie os currículos criados com base nas vagas enviadas." />

  <div class="grid gap-4" v-if="resumesList.length > 0">
    <ResumePreview v-for="resume in resumesList" :key="resume.id" :resume="resume"
      @remove="() => removeFromList(resume.id)" />

    <div class="flex flex-col items-center py-6 gap-2">
      <BaseButton v-if="hasMore" :disabled="isFetchingMore" @click.prevent="getResumes" type="button">
        <span v-if="isFetchingMore">Carregando...</span>
        <span v-else>Carregar mais currículos</span>
      </BaseButton>

      <span v-else class="text-sm text-gray-400">
        Todas os currículos carregadas
      </span>

      <span class="text-xs text-gray-400">
        {{ resumesList.length }} de {{ total }} currículos
      </span>
    </div>
  </div>

  <div v-else class="text-center space-y-3">
    <p class="text-gray-500">Você ainda não gerou nenhum currículo personalizado.</p>

    <router-link :to="{ name: 'ResumeGenerate' }" class="text-primary font-medium hover:underline">
      Criar meu primeiro currículo
    </router-link>
  </div>
</template>

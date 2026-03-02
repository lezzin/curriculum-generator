<script setup lang="ts">
import { onMounted, onUnmounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useToast } from './composables/useToast';
import { sseService } from './services/sse.service';
import type { Resume } from './interfaces/resume.interfaces';
import type { MarketplaceProposal } from './interfaces/freelance.interfaces';
import LoadContainer from './components/ui/LoadContainer.vue';
import AppHeader from './components/layout/AppHeader.vue';
import BaseToast from './components/ui/BaseToast.vue';
import AppContainer from './components/layout/AppContainer.vue';
import { api } from './services/api/api';
import { useAuthStore } from './stores/auth';

const route = useRoute();
const authStore = useAuthStore();
const { show } = useToast();

const setupSSE = () => {
  sseService.init(api);

  sseService.on('message', (value: string) => {
    show({
      message: value,
      type: 'info'
    });
  });

  sseService.on<Resume>('resume-generated', () => {
    if (route.name !== 'ResumeHistory') {
      show({
        message: 'Novo currículo gerado com sucesso!',
        link: { label: 'Ver histórico', to: 'ResumeHistory' },
        duration: 0,
      });
    }
  });

  sseService.on<MarketplaceProposal>('proposal-generated', () => {
    if (route.name !== 'FreelanceProposalHistory') {
      show({
        message: 'Nova proposta gerada com sucesso!',
        link: { label: 'Ver histórico', to: 'FreelanceProposalHistory' },
        duration: 0,
      });
    }
  });
};

onMounted(async () => {
  if (authStore.user) {
    setupSSE();
  }
});

watch(
  () => authStore.user,
  (newUser, oldUser) => {
    if (!oldUser && newUser) {
      setupSSE();
    } else if (oldUser && !newUser) {
      sseService.close();
    }
  }
);

onUnmounted(() => {
  sseService.close();
});
</script>

<template>
  <AppHeader />

  <LoadContainer :loading="authStore.isAuthLoading">
    <AppContainer class="p-8 space-y-8">
      <router-view></router-view>
      <BaseToast />
    </AppContainer>
  </LoadContainer>
</template>
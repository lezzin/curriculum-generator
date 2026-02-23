<script setup lang="ts">
import AppContainer from './components/layout/AppContainer.vue';
import AppHeader from './components/layout/AppHeader.vue';
import BaseToast from './components/ui/BaseToast.vue';
import { useApi } from './composables/useApi';
import { useSSE } from './composables/useSSE';
import { useToast } from './composables/useToast';
import type { MarketplaceProposal } from './interfaces/freelance.interfaces';
import type { Resume } from './interfaces/resume.interfaces';

const { api } = useApi()
const { show } = useToast()

useSSE<Resume>({
  api,
  eventName: "resume-generated",
  onEvent: () => {
    show("Currículo gerado com sucesso! Acesse a seção de histórico para visualizar.")
  },
  onError: () => {
    show("Erro na conexão SSE", "error")
  }
})

useSSE<MarketplaceProposal>({
  api,
  eventName: "proposal-generated",
  onEvent: () => {
    show("Proposta gerada com sucesso! Acesse a seção de histórico para visualizar.")
  },
  onError: () => {
    show("Erro na conexão SSE", "error")
  }
})
</script>

<template>
  <AppHeader />

  <AppContainer class="p-8 space-y-8">
    <router-view></router-view>
    <BaseToast />
  </AppContainer>
</template>

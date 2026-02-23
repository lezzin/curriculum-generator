<script setup lang="ts">
import { onUnmounted } from 'vue';
import AppContainer from './components/layout/AppContainer.vue';
import AppHeader from './components/layout/AppHeader.vue';
import BaseToast from './components/ui/BaseToast.vue';
import { useApi } from './composables/useApi';
import { useToast } from './composables/useToast';
import { sseService } from './services/sse.service';
import type { Resume } from './interfaces/resume.interfaces';
import type { MarketplaceProposal } from './interfaces/freelance.interfaces';
import { useRoute } from 'vue-router';

const { api } = useApi()
const { show } = useToast()
const route = useRoute()

sseService.init(api)

sseService.on<Resume>("resume-generated", () => {
  if (route.name !== 'ResumeHistory') {
    show("Currículo gerado com sucesso!")
  }
})

sseService.on<MarketplaceProposal>("proposal-generated", () => {
  if (route.name !== 'FreelanceProposalHistory') {
    show("Proposta gerada com sucesso!")
  }
})

onUnmounted(() => {
  sseService.close()
})
</script>

<template>
  <AppHeader />
  <AppContainer class="p-8 space-y-8">
    <router-view></router-view>
    <BaseToast />
  </AppContainer>
</template>
<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import { usePaginated } from '../../composables/usePaginated';
import AppTitle from '../../components/layout/AppTitle.vue';
import { useAuthStore } from '../../stores/auth';
import { sseService } from '../../services/sse.service';
import BasePagination from '../../components/ui/BasePagination.vue';
import type { FreelanceProposal } from '../../interfaces/freelance.interfaces';
import ProposalPreview from '../../components/freelance/ProposalPreview.vue';

const authStore = useAuthStore();

const {
  items: proposals,
  hasMore,
  isFetching,
  total,
  fetch,
  remove,
  prepend,
} = usePaginated<FreelanceProposal>('/freelance/proposal/all', 10);

function handleProposalGenerated(data: FreelanceProposal) {
  if (data.userId !== authStore.user?.id) return;
  prepend(data, (item) => item.id);
}

onMounted(async () => {
  await fetch((item) => item.id);
  sseService.on('proposal-generated', handleProposalGenerated);
});

onUnmounted(() => {
  sseService.off('proposal-generated', handleProposalGenerated);
});

function removeFromList(id: string) {
  remove(id, item => item.id);
}
</script>

<template>
  <AppTitle title="Minhas Propostas Geradas"
    subtitle="Visualize e acompanhe as propostas criadas a partir das oportunidades selecionadas." />

  <div v-if="proposals.length" class="grid gap-4">
    <ProposalPreview v-for="proposal in proposals" :key="proposal.id" :proposal="proposal"
      @remove="() => removeFromList(proposal.id)" />

    <BasePagination :items="proposals" :hasMore="hasMore" :isFetching="isFetching"
      :loadMore="() => fetch(item => item.id)" :total="total" />
  </div>

  <div v-else class="text-center space-y-3">
    <p class="text-gray-500">
      Você ainda não gerou nenhuma proposta personalizada.
    </p>

    <router-link :to="{ name: 'FreelanceProposalGenerate' }" class="text-primary font-medium hover:underline">
      Criar minha primeira proposta
    </router-link>
  </div>
</template>
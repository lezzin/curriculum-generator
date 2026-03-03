<script setup lang="ts">
import { onMounted, reactive } from 'vue'
import { useApi } from '../../composables/useApi'
import { sseService } from '../../services/sse.service'
import type { MarketplaceProposal } from '../../interfaces/freelance.interfaces'
import ProposalPreview from '../../components/freelance/ProposalPreview.vue'
import AppTitle from '../../components/layout/AppTitle.vue'
import LoadContainer from '../../components/ui/LoadContainer.vue'
import { useToast } from '../../composables/useToast'
import { useAuthStore } from '../../stores/auth'

const { request, loading: isLoading } = useApi()
const authStore = useAuthStore()
const { show } = useToast()

const proposalList = reactive<MarketplaceProposal[]>([])

async function getProposals() {
    const { data, error } = await request<MarketplaceProposal[]>('get', '/freelance/proposal/all');

    if (!error) {
        proposalList.length = 0
        if (data) proposalList.push(...data)
        return;
    }

    show({ message: error, type: 'error' })
}

sseService.on<MarketplaceProposal>("proposal-generated", (data) => {
    if (data.userId !== authStore.user?.id) return
    proposalList.unshift(data)
})

onMounted(getProposals)
</script>

<template>
    <AppTitle title="Minhas Propostas Geradas"
        subtitle="Visualize e acompanhe as propostas criadas a partir das oportunidades selecionadas." />

    <LoadContainer :loading="isLoading">
        <div class="grid gap-4" v-if="proposalList.length > 0">
            <ProposalPreview v-for="proposal in proposalList" :key="proposal.id" :proposal="proposal" />
        </div>

        <div v-else class="text-center space-y-3">
            <p class="text-gray-500">
                Você ainda não gerou nenhuma proposta personalizada.
            </p>
            <router-link :to="{ name: 'FreelanceProposalGenerate' }" class="text-primary font-medium hover:underline">
                Criar minha primeira proposta
            </router-link>
        </div>
    </LoadContainer>
</template>
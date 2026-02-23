<script setup lang="ts">
import { onMounted, reactive } from 'vue'
import { useApi } from '../composables/useApi'
import { sseService } from '../services/sse.service'
import type { MarketplaceProposal } from '../interfaces/freelance.interfaces'
import ProposalPreview from '../components/freelance/ProposalPreview.vue'
import AppTitle from '../components/layout/AppTitle.vue'

const { api, request } = useApi()
const proposalList = reactive<MarketplaceProposal[]>([])

async function getProposals() {
    const data = await request(async () => {
        const response = await api.get("/freelance/proposal/all")
        return response.data as MarketplaceProposal[]
    })

    proposalList.length = 0
    if (data) proposalList.push(...data)
}

sseService.on<MarketplaceProposal>("proposal-generated", (data) => proposalList.unshift(data))

onMounted(getProposals)
</script>

<template>
    <AppTitle title="Propostas Geradas" />

    <div class="grid gap-4">
        <ProposalPreview v-for="proposal in proposalList" :key="proposal.id" :proposal="proposal" />
    </div>
</template>
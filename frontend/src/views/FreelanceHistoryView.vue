<script setup lang="ts">
import { onMounted, reactive } from 'vue'
import { useApi } from '../composables/useApi'
import AppTitle from '../components/layout/AppTitle.vue'
import ProposalPreview from '../components/freelance/ProposalPreview.vue'
import type { MarketplaceProposal } from '../interfaces/freelance.interfaces'

const { api, request } = useApi()
const proposalList = reactive<MarketplaceProposal[]>([])

async function getProposals() {
    const data = await request(async () => {
        const response = await api.get("/freelance/proposal/all")
        return response.data as MarketplaceProposal[]
    })

    if (!data) {
        proposalList.length = 0
        return
    }

    proposalList.length = 0
    proposalList.push(...data)
}

onMounted(() => {
    getProposals()
})
</script>

<template>
    <AppTitle title="Propostas Geradas" />

    <div class="grid gap-4">
        <ProposalPreview v-for="proposal in proposalList" :key="proposal.id" :proposal="proposal" />
    </div>
</template>
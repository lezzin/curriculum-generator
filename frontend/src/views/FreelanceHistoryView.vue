<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { useApi } from '../composables/useApi'
import { sseService } from '../services/sse.service'
import type { MarketplaceProposal } from '../interfaces/freelance.interfaces'
import ProposalPreview from '../components/freelance/ProposalPreview.vue'
import AppTitle from '../components/layout/AppTitle.vue'
import LoadContainer from '../components/ui/LoadContainer.vue'
import { useToast } from '../composables/useToast'
import { useAuth } from '../composables/useAuth'

const { api, request } = useApi()
const { userId } = useAuth()
const { show } = useToast()

const proposalList = reactive<MarketplaceProposal[]>([])
const isLoading = ref(true)

async function getProposals() {
    try {
        const data = await request(async () => {
            const response = await api.get("/freelance/proposal/all")
            return response.data as MarketplaceProposal[]
        })

        proposalList.length = 0
        if (data) proposalList.push(...data)
    } catch (error: any) {
        show({
            message: error.message || "Erro ao carregar propostas.",
            type: "error",
        })
    } finally {
        isLoading.value = false
    }
}

sseService.on<MarketplaceProposal>("proposal-generated", (data) => {
    if (data.userId !== userId.value) return
    proposalList.unshift(data)
})

onMounted(getProposals)
</script>

<template>
    <AppTitle title="Propostas Geradas" />

    <LoadContainer :loading="isLoading">
        <div class="grid gap-4" v-if="proposalList.length > 0">
            <ProposalPreview v-for="proposal in proposalList" :key="proposal.id" :proposal="proposal" />
        </div>
        <p v-else class="text-center text-gray-500">Nenhuma proposta gerada ainda.</p>
    </LoadContainer>
</template>
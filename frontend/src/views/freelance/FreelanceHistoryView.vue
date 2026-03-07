<script setup lang="ts">
import { onMounted, onUnmounted, ref, computed } from 'vue'
import { useApi } from '../../composables/api/useApi'
import { sseService } from '../../services/sse.service'
import type { FreelanceProposal } from '../../interfaces/freelance.interfaces'
import ProposalPreview from '../../components/freelance/ProposalPreview.vue'
import AppTitle from '../../components/layout/AppTitle.vue'
import { useToast } from '../../composables/useToast'
import { useAuthStore } from '../../stores/auth'
import type { PaginatedResult } from '../../interfaces/paginate.interfaces'
import BaseButton from '../../components/ui/BaseButton.vue'

const { request } = useApi()
const authStore = useAuthStore()
const { show } = useToast()

const proposalList = ref<FreelanceProposal[]>([])

const isFetchingMore = ref(false)
const total = ref(0)
const page = ref(1)

const proposalMap = new Map<string, boolean>()

const hasMore = computed(
  () => total.value > 0 && proposalList.value.length < total.value
)

function addUniqueProposals(list: FreelanceProposal[]) {
  const newItems: FreelanceProposal[] = []

  for (const proposal of list) {
    const idStr = String(proposal.id)

    if (!proposalMap.has(idStr)) {
      proposalMap.set(idStr, true)
      newItems.push(proposal)
    }
  }

  proposalList.value.push(...list)
}

async function getProposals() {
  if (isFetchingMore.value) return
  if (!hasMore.value && total.value !== 0) return

  isFetchingMore.value = true

  const { data, error } = await request<PaginatedResult<FreelanceProposal>>('get', '/freelance/proposal/all', {
    page: page.value,
    limit: 10
  })

  if (error) {
    show({ message: error, type: 'error' })
    isFetchingMore.value = false
    return
  }

  if (data) {
    total.value = data.total
    addUniqueProposals(data.data)
    page.value++
  }

  isFetchingMore.value = false
}

function removeFromList(proposalId: string) {
  proposalList.value = proposalList.value.filter(
    (proposal) => proposal.id !== proposalId
  )

  proposalMap.delete(proposalId)
  total.value--
}

function handleProposalGenerated(data: FreelanceProposal) {
  if (data.userId !== authStore.user?.id) return

  if (proposalMap.has(data.id)) return
  proposalMap.set(data.id, true)
  proposalList.value.unshift(data)

  total.value++
}

onMounted(async () => {
  await getProposals()

  sseService.on<FreelanceProposal>(
    'proposal-generated',
    handleProposalGenerated
  )
})

onUnmounted(() => {
  sseService.off('proposal-generated', handleProposalGenerated)
})
</script>

<template>
  <AppTitle title="Minhas Propostas Geradas"
    subtitle="Visualize e acompanhe as propostas criadas a partir das oportunidades selecionadas." />

  <div v-if="proposalList.length > 0" class="grid gap-4">
    <ProposalPreview v-for="proposal in proposalList" :key="proposal.id" :proposal="proposal"
      @remove="() => removeFromList(proposal.id)" />

    <div class="flex flex-col items-center py-6 gap-2">
      <BaseButton v-if="hasMore" :disabled="isFetchingMore" @click.prevent="getProposals" type="button">
        <span v-if="isFetchingMore">Carregando...</span>
        <span v-else>Carregar mais propostas</span>
      </BaseButton>

      <span v-else class="text-sm text-gray-400">
        Todas as propostas carregadas
      </span>

      <span class="text-xs text-gray-400">
        {{ proposalList.length }} de {{ total }} propostas
      </span>
    </div>
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
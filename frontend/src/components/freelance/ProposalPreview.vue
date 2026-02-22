<script setup lang="ts">
import { computed, ref, watch } from "vue"
import type { MarketplaceProposal } from "../../interfaces/freelance.interfaces"
import BaseButton from "../ui/BaseButton.vue"

const props = defineProps<{
    proposal: MarketplaceProposal
}>()

const copied = ref(false)
const editableText = ref('')

const formattedProposal = computed(() => {
    if (!props.proposal) return ''

    return `${props.proposal.message}

Investimento: R$ ${props.proposal.bidAmount}
Prazo estimado: ${props.proposal.deliveryDays} dias

Portfólio:
https://leandroadrian.vercel.app`
})

// Sempre que gerar nova proposta, atualiza textarea
watch(formattedProposal, (value) => {
    editableText.value = value
}, { immediate: true })

async function copyProposal() {
    if (!editableText.value) return

    await navigator.clipboard.writeText(editableText.value)
    copied.value = true

    setTimeout(() => {
        copied.value = false
    }, 2000)
}
</script>

<template>
    <div v-if="proposal" class="rounded-2xl p-6 space-y-5 shadow-sm
           transition-colors duration-300
           bg-white border border-zinc-200">
        <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-zinc-800">
                Proposta Gerada
            </h3>

            <BaseButton @click="copyProposal" variant="outline" size="sm">
                {{ copied ? 'Copiado!' : 'Copiar proposta' }}
            </BaseButton>
        </div>

        <textarea v-model="editableText" rows="12" class="w-full resize-none
             text-sm leading-relaxed
             rounded-xl p-4
             transition-colors duration-300
             bg-zinc-50 text-zinc-700 border border-zinc-200
             focus:outline-none focus:ring-2 focus:ring-indigo-500"></textarea>
    </div>
</template>
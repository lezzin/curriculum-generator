<script setup lang="ts">
import { computed, ref, watchEffect } from "vue"
import type { MarketplaceProposal } from "../../interfaces/freelance.interfaces"
import BaseButton from "../ui/BaseButton.vue"
import { toHumanReadableDate } from "../../helper/string.helper";
import CardContainer from "../ui/card/CardContainer.vue";

const props = defineProps<{
    proposal: MarketplaceProposal
}>()

const copied = ref(false)
const editableText = ref("")
const isOpen = ref(false)

const formattedProposal = computed(() => {
    if (!props.proposal) return ''

    return `${props.proposal.message}

Investimento: R$ ${props.proposal.bidAmount}
Prazo estimado: ${props.proposal.deliveryDays} dias

Portfólio:
https://leandroadrian.vercel.app`
})

const shortPrompt = computed(() => {
    const prompt = props.proposal?.prompt ?? ""
    if (!prompt) return ""
    return prompt.length > 120 ? `${prompt.slice(0, 120)}...` : prompt
})

watchEffect(() => {
    editableText.value = formattedProposal.value
})

function togglePrompt() {
    isOpen.value = !isOpen.value
}

async function copyProposal() {
    if (!editableText.value) return

    try {
        await navigator.clipboard.writeText(editableText.value)
        copied.value = true
        setTimeout(() => (copied.value = false), 2000)
    } catch (error) {
        console.error("Erro ao copiar:", error)
    }
}
</script>

<template>
    <div v-if="proposal"
        class="rounded-2xl p-6 space-y-5 shadow-sm bg-white border border-zinc-200 transition-all duration-300">
        <div class="flex items-center justify-between">
            <small class="text-gray-500">
                Criado em:
                {{ toHumanReadableDate(proposal.createdAt ?? "") }}
            </small>

            <BaseButton @click="copyProposal" variant="outline" size="sm">
                {{ copied ? "Copiado!" : "Copiar proposta" }}
            </BaseButton>
        </div>

        <div class="space-y-1">
            <label class="text-sm font-medium text-zinc-700">
                Solicitação
            </label>

            <CardContainer variant="text" @click="togglePrompt">
                {{ isOpen ? proposal.prompt : shortPrompt }}
            </CardContainer>
        </div>

        <div class="space-y-1">
            <label class="text-sm font-medium text-zinc-700">
                Proposta
            </label>

            <textarea v-model="editableText" rows="12" class="w-full resize-none text-sm leading-relaxed
                rounded-xl p-4
                bg-zinc-50 text-zinc-700 border border-zinc-200
                focus:outline-none focus:ring-2 focus:ring-indigo-500
                transition-all duration-300" />
        </div>
    </div>
</template>
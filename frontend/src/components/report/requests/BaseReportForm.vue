<script setup lang="ts">
import BaseButton from '../../ui/BaseButton.vue'
import BaseModal from '../../ui/modal/BaseModal.vue'
import CardContainer from '../../ui/card/CardContainer.vue'
import AppTitle from '../../layout/AppTitle.vue'

interface Props {
    isOpen: boolean
    title: string
    description: string
    modalTitle: string
}

interface Emit {
    (e: 'close'): void
    (e: 'update:isOpen', value: boolean): void
}

defineProps<Props>()
const emit = defineEmits<Emit>()
</script>

<template>
    <CardContainer size="sm" class="bg-slate-50 flex items-center justify-between">
        <div>
            <p class="font-medium">{{ title }}</p>

            <p class="text-sm text-gray-500">
                {{ description }}
            </p>
        </div>

        <BaseButton @click="$emit('update:isOpen', true)">
            Gerar relatório
        </BaseButton>
    </CardContainer>

    <BaseModal :is-open="isOpen" @close="emit('close')">
        <div class="space-y-6">
            <AppTitle :title="modalTitle" />
            <slot />
        </div>
    </BaseModal>
</template>
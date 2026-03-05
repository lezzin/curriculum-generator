<script setup lang="ts">
import BaseButton from '../BaseButton.vue'
import BaseModal from './BaseModal.vue'

interface Props {
    isOpen: boolean
    title?: string
    message?: string
}

interface Emits {
    (e: 'confirm'): void
    (e: 'cancel'): void
}

defineProps<Props>()
defineEmits<Emits>()
</script>

<template>
    <BaseModal :is-open="isOpen" size="sm" @close="$emit('cancel')">
        <h2 class="text-lg font-semibold mb-2">
            {{ title || 'Confirmação' }}
        </h2>

        <p class="text-gray-600 mb-6">
            {{ message || 'Tem certeza que deseja continuar?' }}
        </p>

        <div class="flex justify-end gap-3">
            <BaseButton class="px-4 py-2 bg-gray-200 rounded" @click="$emit('cancel')">
                Cancelar
            </BaseButton>

            <BaseButton variant="destructive" @click="$emit('confirm')">
                Confirmar
            </BaseButton>
        </div>
    </BaseModal>
</template>
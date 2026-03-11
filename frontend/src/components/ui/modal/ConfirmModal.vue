<script setup lang="ts">
import BaseButton, { type Variant } from '../BaseButton.vue';
import BaseModal from './BaseModal.vue';

interface Props {
  isOpen: boolean;
  title?: string;
  message?: string;
  confirmVariant?: Variant;
  cancelVariant?: Variant;
}

interface Emits {
  (e: 'confirm'): void;
  (e: 'cancel'): void;
}

withDefaults(defineProps<Props>(), {
  confirmVariant: 'destructive',
  cancelVariant: 'default',
});

defineEmits<Emits>();
</script>

<template>
  <BaseModal :is-open="isOpen" size="sm" @close="$emit('cancel')">
    <h2 class="text-lg font-semibold mb-2">
      {{ title || 'Confirmação' }}
    </h2>

    <p class="text-gray-600 mb-6" v-html="message || 'Tem certeza que deseja continuar?'"></p>

    <div class="flex justify-end gap-3">
      <BaseButton :variant="cancelVariant" @click="$emit('cancel')"> Cancelar </BaseButton>

      <BaseButton :variant="confirmVariant" @click="$emit('confirm')"> Confirmar </BaseButton>
    </div>
  </BaseModal>
</template>

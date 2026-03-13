<script setup lang="ts">
import { ref } from 'vue';
import RotateArrow from '../icon/RotateArrow.vue';

interface Props {
  title: string;
  description?: string;
  defaultOpen?: boolean;
}

const props = defineProps<Props>();
const isOpen = ref(props.defaultOpen ?? false);

const toggle = () => {
  isOpen.value = !isOpen.value;
};
</script>

<template>
  <div class="border border-app-border rounded-lg overflow-hidden bg-app-surface shadow-sm transition-all duration-200">
    <button type="button" @click="toggle"
      class="w-full flex items-center justify-between p-4 text-left hover:bg-app-surface-muted transition-colors"
      :class="{ 'border-b border-app-border': isOpen }">
      <div class="flex flex-col">
        <span class="text-sm font-semibold text-app-text">{{ title }}</span>
        <span v-if="description" class="text-xs text-app-text-muted">{{ description }}</span>
      </div>

      <rotate-arrow :rotate="isOpen" />
    </button>

    <div v-show="isOpen" class="p-4 bg-app-surface-muted">
      <slot />
    </div>
  </div>
</template>

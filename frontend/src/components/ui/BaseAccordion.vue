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
  <div class="border border-slate-200 dark:border-zinc-800 rounded-lg overflow-hidden bg-white dark:bg-zinc-900 shadow-sm transition-all duration-200">
    <button type="button" @click="toggle"
      class="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors"
      :class="{ 'border-b border-slate-100 dark:border-zinc-800': isOpen }">
      <div class="flex flex-col">
        <span class="text-sm font-semibold text-slate-900 dark:text-zinc-50">{{ title }}</span>
        <span v-if="description" class="text-xs text-slate-500 dark:text-zinc-400">{{ description }}</span>
      </div>

      <rotate-arrow :rotate="isOpen" />
    </button>

    <div v-show="isOpen" class="p-4 bg-slate-50/50 dark:bg-zinc-800/50">
      <slot />
    </div>
  </div>
</template>

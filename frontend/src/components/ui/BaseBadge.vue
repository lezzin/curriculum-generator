<script setup lang="ts">
import { computed } from 'vue';

export type Variant = 'default' | 'success' | 'warning' | 'destructive' | 'info' | 'outline' | 'ghost';

interface Props {
  variant?: Variant;
  text: string;
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
});

const baseClasses = 'inline-flex items-center rounded-md px-2 py-1 text-xs font-medium transition-colors';

const variantClasses = computed(() => {
  const variants: Record<Variant, string> = {
    default: 'bg-gray-900 dark:bg-zinc-50 text-white dark:text-zinc-900',
    success: 'bg-green-600 text-white',
    warning: 'bg-yellow-500 text-white',
    destructive: 'bg-red-600 text-white',
    info: 'bg-blue-600 text-white',
    outline: 'border border-gray-300 dark:border-zinc-800 text-gray-700 dark:text-zinc-300 bg-white dark:bg-zinc-900',
    ghost: 'bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-zinc-300',
  };

  return variants[props.variant];
});

const classes = computed(() => `${baseClasses} ${variantClasses.value}`);
</script>

<template>
  <span :class="classes">
    {{ text }}
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue';

type Variant = 'default' | 'text';
type Size = 'sm' | 'md' | 'lg';

interface Props {
  variant?: Variant;
  size?: Size;
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  size: 'md',
});

const baseClasses = 'rounded-lg shadow-sm border';

const variantClasses = computed(() => {
  const variants: Record<Variant, string> = {
    text: 'text-sm leading-relaxed bg-zinc-50 text-zinc-700 border-zinc-200 whitespace-pre-wrap',
    default: '',
  };

  return variants[props.variant];
});

const sizeClasses = computed(() => {
  const sizes: Record<Size, string> = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  return sizes[props.size];
});

const classes = computed(() => `${baseClasses} ${variantClasses.value} ${sizeClasses.value}`);
</script>

<template>
  <div :class="classes">
    <slot />
  </div>
</template>

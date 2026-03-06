<script setup lang="ts">
import { computed } from 'vue';
import { RouterLink, type RouteLocationNamedRaw } from 'vue-router';

interface Props {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  disabled?: boolean;
  as?: As;
  to?: RouteLocationNamedRaw;
  href?: string;
  target?: string;
}

export type Variant = 'default' | 'outline' | 'ghost' | 'destructive';
type Size = 'sm' | 'md' | 'lg' | 'icon';
type As = 'button' | 'a' | 'router-link';

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  size: 'md',
  loading: false,
  disabled: false,
  as: 'button',
});

const baseClasses =
  'inline-flex items-center justify-center gap-2 rounded font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';

const variantClasses = computed(() => {
  const variants: Record<Variant, string> = {
    default: 'bg-gray-900 text-white hover:bg-gray-800',
    destructive: 'bg-red-600 text-white hover:bg-red-700',
    ghost: 'bg-transparent hover:bg-gray-100 text-gray-900',
    outline: 'border border-gray-300 bg-white hover:bg-gray-100 text-gray-900',
  };

  return variants[props.variant];
});

const sizeClasses = computed(() => {
  const sizes: Record<Size, string> = {
    sm: 'h-8 px-3 text-sm',
    md: 'h-10 px-4 text-sm',
    lg: 'h-11 px-6 text-base',
    icon: 'h-10 w-10 p-0',
  };

  return sizes[props.size];
});

const disabledClasses = computed(() =>
  props.disabled || props.loading ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''
);
const classes = computed(() => `${baseClasses} ${variantClasses.value} ${sizeClasses.value} ${disabledClasses.value}`);

const component = computed(() => {
  if (props.as === 'router-link') return RouterLink;
  return props.as;
});

const componentProps = computed(() => {
  if (props.as === 'a') {
    return {
      href: props.href,
      target: props.target,
    };
  }

  if (props.as === 'router-link') {
    return {
      to: props.to,
    };
  }

  return {
    disabled: props.disabled || props.loading,
  };
});
</script>

<template>
  <component :is="component" v-bind="componentProps" :class="classes">
    <span v-if="loading" class="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
    <slot />
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue';

type Variant = "default" | "text"
type Size = "sm" | "md" | "lg"

const props = withDefaults(
    defineProps<{
        variant?: Variant,
        size?: Size
    }>(),
    {
        variant: 'default',
        size: 'md'
    }
)

const baseClasses = "rounded-lg shadow-sm border"

const variantClasses = computed(() => {
    switch (props.variant) {
        case "text":
            return "text-sm leading-relaxed bg-zinc-50 text-zinc-700 border-zinc-200 whitespace-pre-wrap"
        default:
            return ""
    }
})

const sizeClasses = computed(() => {
    switch (props.size) {
        case "sm":
            return "p-4"
        case "lg":
            return "p-8"
        default:
            return "p-6"
    }
})

const classes = computed(() =>
    `${baseClasses} ${variantClasses.value} ${sizeClasses.value}`
)
</script>

<template>
    <div :class="classes">
        <slot />
    </div>
</template>
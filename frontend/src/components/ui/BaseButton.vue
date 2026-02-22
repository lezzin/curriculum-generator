<script setup lang="ts">
import { computed } from "vue"

type Variant = "default" | "outline" | "ghost" | "destructive"
type Size = "sm" | "md" | "lg" | "icon"

const props = withDefaults(defineProps<{
    variant?: Variant
    size?: Size
    loading?: boolean
    disabled?: boolean
    as?: "button" | "a"
    href?: string
    target?: string
}>(), {
    variant: "default",
    size: "md",
    loading: false,
    disabled: false,
    as: "button"
})

const baseClasses =
    "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2"

const variantClasses = computed(() => {
    switch (props.variant) {
        case "outline":
            return "border border-gray-300 bg-white hover:bg-gray-100 text-gray-900"
        case "ghost":
            return "bg-transparent hover:bg-gray-100 text-gray-900"
        case "destructive":
            return "bg-red-600 text-white hover:bg-red-700"
        default:
            return "bg-gray-900 text-white hover:bg-gray-800"
    }
})

const sizeClasses = computed(() => {
    switch (props.size) {
        case "sm":
            return "h-8 px-3 text-sm"
        case "lg":
            return "h-11 px-6 text-base"
        case "icon":
            return "h-10 w-10 p-0"
        default:
            return "h-10 px-4 text-sm"
    }
})

const disabledClasses = computed(() => {
    if (props.disabled || props.loading)
        return "opacity-50 cursor-not-allowed pointer-events-none"
    return ""
})

const classes = computed(() =>
    `${baseClasses} ${variantClasses.value} ${sizeClasses.value} ${disabledClasses.value}`
)
</script>

<template>
    <component :is="as" :href="as === 'a' ? href : undefined" :target="as === 'a' ? target : undefined"
        :disabled="as === 'button' ? disabled || loading : undefined" :class="classes">
        <span v-if="loading" class="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        <slot />
    </component>
</template>
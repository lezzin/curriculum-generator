<script setup lang="ts">
import { computed } from 'vue';
import { getFirstLetter } from '../../helper/string.helper';

interface Props {
    name: string
    size?: Size
}

type Size = "sm" | "md" | "lg"

const props = withDefaults(defineProps<Props>(), {
    size: 'md'
})

const sizeClasses = computed(() => {
    const sizes: Record<Size, string> = {
        lg: "w-16 h-16 text-lg",
        md: "w-12 h-12 text-lg",
        sm: "w-9 h-9 text-sm",
    }

    return sizes[props.size]
})

const baseClasses = "rounded-full bg-gray-900 text-white flex items-center justify-center text-lg font-semibold"

const classes = computed(() => `${baseClasses} ${sizeClasses.value}`)
</script>

<template>
    <div :class="classes">
        {{ getFirstLetter(name) }}
    </div>
</template>
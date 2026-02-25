<script setup lang="ts">
import { computed } from 'vue';
import { getFirstLetter } from '../../helper/string.helper';

type Size = "sm" | "md" | "lg"

const props = withDefaults(defineProps<{
    name: string
    size?: Size
}>(), {
    size: 'md'
})

const sizeClasses = computed(() => {
    switch (props.size) {
        case "sm":
            return "w-9 h-9 text-sm"
        case "lg":
            return "w-16 h-16 text-lg"
        default:
            return "w-12 h-12 text-lg"
    }
})

const baseClasses = "rounded-full bg-gray-900 text-white flex items-center justify-center text-lg font-semibold"

const classes = computed(() => `${baseClasses} ${sizeClasses.value}`)
</script>

<template>
    <div :class="classes">
        {{ getFirstLetter(name) }}
    </div>
</template>
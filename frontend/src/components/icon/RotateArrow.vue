<script setup lang="ts">
defineProps<{
    rotate: boolean
}>()
</script>

<template>
    <svg class="w-4 h-4 transition-transform duration-200" :class="{ 'rotate-180': rotate }" fill="none"
        stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
    </svg>
</template>
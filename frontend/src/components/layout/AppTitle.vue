<script setup lang="ts">
defineProps<{
    title: string
    subtitle?: string
}>()
</script>

<template>
    <div class="mb-12">
        <div class="border-b pb-6">
            <h1 class="text-3xl md:text-4xl font-bold tracking-tight text-gray-900">
                {{ title }}
            </h1>

            <p v-if="subtitle" class="mt-3 text-base md:text-lg text-gray-600 max-w-2xl">
                {{ subtitle }}
            </p>
        </div>
    </div>
</template>
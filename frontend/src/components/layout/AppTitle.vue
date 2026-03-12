<script setup lang="ts">
interface Props {
  title: string;
  subtitle?: string;
}

defineProps<Props>();
</script>

<template>
  <div class="mb-12">
    <div class="border-b dark:border-zinc-800 pb-6">
      <h1 class="text-3xl font-bold tracking-tight text-gray-900 dark:text-zinc-50">
        {{ title }}
      </h1>

      <p v-if="subtitle" class="mt-3 text-base md:text-lg text-gray-600 dark:text-zinc-400 max-w-2xl">
        {{ subtitle }}
      </p>
    </div>
  </div>
</template>

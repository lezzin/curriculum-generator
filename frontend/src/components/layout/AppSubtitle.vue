<script setup lang="ts">
interface Props {
  title: string;
  subtitle?: string;
}

defineProps<Props>();
</script>

<template>
  <div class="mb-6">
    <div class="border-b pb-3">
      <h2 class="text-2xl font-bold tracking-tight text-gray-800">
        {{ title }}
      </h2>

      <p v-if="subtitle" class="mt-3 text-base md:text-lg text-gray-600 max-w-2xl">
        {{ subtitle }}
      </p>
    </div>
  </div>
</template>

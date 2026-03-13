<script setup lang="ts">
interface Props {
  title: string;
  subtitle?: string;
}

defineProps<Props>();
</script>

<template>
  <div class="mb-6">
    <div class="border-b border-app-border pb-3">
      <h2 class="text-2xl font-bold tracking-tight text-app-text">
        {{ title }}
      </h2>

      <p v-if="subtitle" class="mt-3 text-base md:text-lg text-app-text-muted max-w-2xl">
        {{ subtitle }}
      </p>
    </div>
  </div>
</template>

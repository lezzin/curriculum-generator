<script setup lang="ts">
import LoadSpinner from '../icon/LoadSpinner.vue';

interface Props {
  loading: boolean;
}

defineProps<Props>();
</script>

<template>
  <div class="flex items-center justify-center h-48" v-if="loading">
    <LoadSpinner />
  </div>
  <slot v-else />
</template>

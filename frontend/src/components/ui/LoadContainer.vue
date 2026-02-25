<script setup lang="ts">
import LoadSpinner from '../icon/LoadSpinner.vue';

defineProps<{
    loading: boolean
}>()
</script>

<template>
    <div class="flex items-center justify-center h-48" v-if="loading">
        <LoadSpinner />
    </div>
    <slot v-else />
</template>

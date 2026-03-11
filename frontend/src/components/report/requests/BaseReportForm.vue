<script setup lang="ts">
import CardContainer from '../../ui/card/CardContainer.vue';
import AppSubtitle from '../../layout/AppSubtitle.vue';

interface Props {
  title: string;
  description: string;
}

defineProps<Props>();
</script>

<template>
  <CardContainer size="sm" class="bg-slate-50">
    <AppSubtitle :title="title" :subtitle="description" />
    <slot />
  </CardContainer>
</template>

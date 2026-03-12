<script setup lang="ts">
import { computed } from 'vue';
import BaseButton from '../ui/BaseButton.vue';
import type { Meta } from '../../interfaces/report.interfaces';

const props = defineProps<{
  meta: Meta;
  page: number;
  loading: boolean;
}>();

const emit = defineEmits(['update:page', 'change']);

const visiblePages = computed(() => {
  const current = props.meta.current_page;
  const last = props.meta.last_page;

  const delta = 2;

  const start = Math.max(1, current - delta);
  const end = Math.min(last, current + delta);

  const pages: number[] = [];

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return pages;
});

const goToPage = (p: number) => {
  if (p < 1 || p > props.meta.last_page) return;

  emit('update:page', p);
  emit('change');
};

const firstPage = () => goToPage(1);
const prevPage = () => goToPage(props.page - 1);
const nextPage = () => goToPage(props.page + 1);
const lastPage = () => goToPage(props.meta.last_page);
</script>

<template>
  <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mt-4">
    <span class="text-sm text-gray-600">
      Mostrando
      {{ meta.from }}
      até
      {{ meta.to }}
      de
      {{ meta.total }}
      registros
    </span>

    <div class="flex items-center gap-1">
      <BaseButton size="sm" variant="outline" :disabled="page === 1 || loading" @click="firstPage"> « </BaseButton>

      <BaseButton size="sm" variant="outline" :disabled="page === 1 || loading" @click="prevPage"> ‹ </BaseButton>

      <BaseButton
        v-for="p in visiblePages"
        :key="p"
        size="sm"
        :variant="p === page ? 'default' : 'outline'"
        :disabled="loading"
        @click="goToPage(p)"
      >
        {{ p }}
      </BaseButton>

      <BaseButton size="sm" variant="outline" :disabled="page === meta.last_page || loading" @click="nextPage">
        ›
      </BaseButton>

      <BaseButton size="sm" variant="outline" :disabled="page === meta.last_page || loading" @click="lastPage">
        »
      </BaseButton>
    </div>
  </div>
</template>

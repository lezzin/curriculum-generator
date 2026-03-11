<script setup lang="ts">
import BaseButton from './BaseButton.vue';

const props = defineProps<{
  items: any[];
  hasMore: boolean;
  total: number;
  isFetching: boolean;
  loadMore: () => void;
}>();
</script>

<template>
  <div class="flex flex-col items-center py-6 gap-2">
    <BaseButton v-if="hasMore" :disabled="isFetching" @click.prevent="loadMore" type="button">
      <span v-if="isFetching">Carregando...</span>
      <span v-else>Carregar mais</span>
    </BaseButton>

    <span v-else class="text-sm text-gray-400"> Todos os itens carregados </span>

    <span class="text-xs text-gray-400"> {{ items.length }} de {{ total ?? '?' }} itens </span>
  </div>
</template>

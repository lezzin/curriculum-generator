<script setup lang="ts">
import BaseButton from '../ui/BaseButton.vue';
import CardContainer from '../ui/card/CardContainer.vue';

defineEmits(['create']);
</script>

<template>
  <CardContainer size="sm" class="bg-slate-50 flex items-center justify-between">
    <div>
      <p class="font-medium">Gerar relatório</p>
      <p class="text-sm text-gray-500">Solicite um novo relatório de currículos.</p>
    </div>

    <BaseButton @click="$emit('create')"> Gerar relatório </BaseButton>
  </CardContainer>
</template>

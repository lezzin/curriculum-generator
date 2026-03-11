<script setup lang="ts">
import InputField from './InputField.vue';
import TextAreaField from './TextAreaField.vue';
import BaseButton from '../BaseButton.vue';

defineProps<{
  fields: any[];
  onRemove: (index: number) => void;
  onAdd: () => void;
}>();
</script>

<template>
  <div v-for="(field, i) in fields" :key="field.key" class="border p-4 rounded-md space-y-2">
    <div class="flex justify-between items-center">
      <h3 class="font-semibold text-gray-700">Projeto {{ i + 1 }}</h3>
      <BaseButton type="button" variant="ghost" size="sm" @click="onRemove(i)" class="text-red-500 hover:text-red-700">
        Remover
      </BaseButton>
    </div>

    <InputField :name="`projects[${i}].name`" label="Nome do projeto" placeholder="Ex: E-commerce Platform" />

    <TextAreaField :name="`projects[${i}].highlightsString`" label="Destaques" placeholder="Principais conquistas..." />

    <InputField :name="`projects[${i}].technologiesString`" label="Tecnologias" placeholder="React, AWS, etc." />
  </div>

  <BaseButton type="button" variant="outline" size="sm" @click="onAdd" class="w-full"> + Adicionar Projeto </BaseButton>
</template>

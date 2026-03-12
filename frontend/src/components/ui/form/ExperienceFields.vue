<script setup lang="ts">
import type { FieldEntry } from 'vee-validate';
import InputField from './InputField.vue';
import TextAreaField from './TextAreaField.vue';
import BaseButton from '../BaseButton.vue';

defineProps<{
  fields: FieldEntry<any>[];
  onRemove: (index: number) => void;
  onAdd: () => void;
}>();
</script>

<template>
  <div v-for="(field, i) in fields" :key="field.key" class="border dark:border-zinc-800 p-4 rounded-md space-y-2">
    <div class="flex justify-between items-center">
      <h3 class="font-semibold text-gray-700 dark:text-gray-400">Experiência {{ i + 1 }}</h3>
      <BaseButton type="button" variant="ghost" size="sm" @click="onRemove(i)" class="text-red-500 hover:text-red-700">
        Remover
      </BaseButton>
    </div>

    <div class="grid md:grid-cols-2 gap-4">
      <InputField :name="`experiences[${i}].title`" label="Cargo" placeholder="Ex: Desenvolvedor Senior" />
      <InputField :name="`experiences[${i}].company`" label="Empresa" placeholder="Ex: Google" />
    </div>

    <InputField :name="`experiences[${i}].period`" label="Período" placeholder="Ex: Jan 2020 - Dez 2022" />

    <TextAreaField :name="`experiences[${i}].responsibilitiesString`" label="Responsabilidades"
      placeholder="Uma por linha..." />

    <InputField :name="`experiences[${i}].technologiesString`" label="Tecnologias" placeholder="Node.js, Vue, etc." />
  </div>

  <BaseButton type="button" variant="outline" size="sm" @click="onAdd" class="w-full">
    + Adicionar Experiência
  </BaseButton>
</template>

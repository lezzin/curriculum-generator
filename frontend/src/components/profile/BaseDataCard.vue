<script setup lang="ts">
import CardContainer from '../../components/ui/card/CardContainer.vue';
import BaseButton from '../../components/ui/BaseButton.vue';
import TrashIcon from '../icon/TrashIcon.vue';

interface Props {
  title: string;
  description: string;
  content: string | null;
}

type Emits = {
  (e: 'edit'): void;
  (e: 'remove'): void;
};

defineProps<Props>();
defineEmits<Emits>();
</script>

<template>
  <CardContainer class="space-y-4">
    <div class="space-y-1">
      <h2 class="font-semibold">
        {{ title }}
      </h2>

      <p class="text-sm text-gray-600">
        {{ description }}
      </p>
    </div>

    <CardContainer variant="text" size="sm" class="h-80 overflow-y-auto whitespace-pre-wrap">
      <template v-if="content">
        {{ content }}
      </template>

      <template v-else>
        <div class="text-gray-500 space-y-2 text-sm">
          <p>Você ainda não cadastrou uma base.</p>
          <ul class="list-disc ml-5 text-xs space-y-1">
            <li>Resumo profissional</li>
            <li>Principais habilidades</li>
            <li>Experiências relevantes</li>
            <li>Diferenciais competitivos</li>
          </ul>
        </div>
      </template>
    </CardContainer>

    <div class="flex items-center gap-2">
      <BaseButton v-if="content" variant="destructive" size="sm" @click="$emit('remove')">
        <TrashIcon />
      </BaseButton>

      <BaseButton size="sm" variant="outline" @click="$emit('edit')">
        {{ content ? 'Editar base' : 'Adicionar base' }}
      </BaseButton>
    </div>
  </CardContainer>
</template>

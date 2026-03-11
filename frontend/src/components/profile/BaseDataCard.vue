<script setup lang="ts">
import CardContainer from '../../components/ui/card/CardContainer.vue';
import BaseButton from '../../components/ui/BaseButton.vue';
import TrashIcon from '../icon/TrashIcon.vue';
import { computed, ref } from 'vue';
import type { ResumeContent } from './BaseDataResumeCard.vue';
import BaseDataResumeCard from './BaseDataResumeCard.vue';
import BaseModal from '../ui/modal/BaseModal.vue';
import ZoomInIcon from '../icon/ZoomInIcon.vue';
import ConfirmModal from '../ui/modal/ConfirmModal.vue';

interface Props {
  title: string;
  description: string;
  content: string | null;
}

type Emits = {
  (e: 'edit'): void;
  (e: 'remove'): void;
};

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const showZoomModal = ref(false);
const showConfirmModal = ref(false);

const resume = computed<ResumeContent | null>(() => {
  if (!props.content) return null;

  try {
    return JSON.parse(props.content);
  } catch {
    return null;
  }
});

const toggleModal = () => {
  showZoomModal.value = !showZoomModal.value;
};

const handleRemove = () => {
  showConfirmModal.value = false;
  emit('remove');
};
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

    <BaseDataResumeCard :resume="resume" />

    <div class="flex items-center gap-2">
      <BaseButton v-if="content" variant="destructive" size="sm" @click="showConfirmModal = true">
        <TrashIcon />
      </BaseButton>

      <BaseButton v-if="content" variant="outline" size="sm" @click="toggleModal" class="ms-auto">
        <ZoomInIcon />
      </BaseButton>

      <BaseButton size="sm" variant="outline" @click="$emit('edit')">
        {{ content ? 'Editar base' : 'Adicionar base' }}
      </BaseButton>
    </div>
  </CardContainer>

  <BaseModal :is-open="showZoomModal" @close="toggleModal" size="lg">
    <BaseDataResumeCard :resume="resume" height="h-full" />
  </BaseModal>

  <ConfirmModal :is-open="showConfirmModal" @cancel="showConfirmModal = false" @confirm="handleRemove" />
</template>

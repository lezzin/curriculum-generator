<script setup lang="ts">
import { ref, computed, onMounted, capitalize } from 'vue';
import { usePdf } from '../../composables/usePdf';
import { BASE_TEMPLATE_TYPES, type BaseTemplateType, type Resume } from '../../interfaces/resume.interfaces';
import BaseButton from '../ui/BaseButton.vue';
import { toHumanReadableDate } from '../../helper/string.helper';
import CardContainer from '../ui/card/CardContainer.vue';
import RotateArrow from '../icon/RotateArrow.vue';
import BaseDropdown from '../ui/BaseDropdown.vue';
import { useToast } from '../../composables/useToast';
import { useApi } from '../../composables/api/useApi';

interface Props {
  resume: Resume;
}

interface Emits {
  (e: 'remove'): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const isOpen = ref(false);
const shouldToggle = ref(false);
const resume = computed(() => props.resume);

const { show } = useToast();
const { request, loading } = useApi();
const { setPublicPdfUrl, setPublicPageUrl, pageUrl, pdfUrl } = usePdf();
const templateTypes = computed(() => Object.values(BASE_TEMPLATE_TYPES));

function togglePrompt() {
  isOpen.value = !isOpen.value;
}

const shortPrompt = computed(() => {
  const prompt = resume.value.prompt ?? '';

  if (prompt.length > 120) {
    shouldToggle.value = true;
    return prompt.slice(0, 120);
  }

  shouldToggle.value = false;
  return prompt;
});

const goToPdfUrl = async () => {
  if (!pdfUrl.value) return;
  window.open(pdfUrl.value, '_blank');
};

const goToPageUrl = async (template: BaseTemplateType, callable: () => void) => {
  window.open(`${pageUrl.value}/${template}`, '_blank');
  callable();
};

const removeResume = async () => {
  const { error } = await request('post', '/resume/remove', {
    resume_id: props.resume.id,
  });

  if (!error) {
    show({ message: 'Currículo removido com sucesso.', type: 'success' });
    emit('remove');
    return;
  }

  show({ message: error, type: 'error' });
};

onMounted(async () => {
  await setPublicPdfUrl(resume.value.id!);
  setPublicPageUrl(resume.value.id!);
});
</script>

<template>
  <div class="group border rounded-2xl px-5 pb-5 bg-white shadow-sm hover:shadow-md transition-all duration-200"
    @click="togglePrompt" :class="shouldToggle && 'cursor-pointer'">
    <div class="py-4 flex justify-between items-center gap-4">
      <small class="text-gray-500">Criado em: {{ toHumanReadableDate(resume.createdAt ?? '') }}</small>

      <div class="flex items-center gap-3">
        <RotateArrow :rotate="isOpen" v-if="shouldToggle" />

        <BaseDropdown>
          <template #trigger="{ toggle, isOpen }">
            <BaseButton @click.stop="toggle" aria-haspopup="true" :aria-expanded="isOpen" size="sm" variant="outline">
              Páginas
              <RotateArrow :rotate="isOpen" />
            </BaseButton>
          </template>

          <template #default="{ close }">
            <BaseButton v-for="type in templateTypes" :key="type" :value="type" @click.stop="goToPageUrl(type, close)"
              size="sm" variant="ghost" class="dropdown-item">
              {{ capitalize(type) }}
            </BaseButton>
          </template>
        </BaseDropdown>

        <BaseButton @click.stop="goToPdfUrl" size="sm" variant="outline" :disabled="!pdfUrl"> PDF </BaseButton>

        <BaseButton @click.stop="removeResume" size="sm" variant="destructive" :disabled="loading">
          Remover
        </BaseButton>
      </div>
    </div>

    <CardContainer variant="text">
      {{ isOpen ? resume.prompt : shortPrompt }}
    </CardContainer>
  </div>
</template>

<style scoped lang="postcss">
.dropdown-item {
  @apply w-full px-4 py-2 text-gray-600 hover:bg-gray-100 hover:text-black transition;
}
</style>

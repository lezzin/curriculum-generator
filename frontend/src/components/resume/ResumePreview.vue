<script setup lang="ts">
import { ref, computed, capitalize } from 'vue';
import { BASE_TEMPLATE_TYPES, type BaseTemplateType, type Resume } from '../../interfaces/resume.interfaces';
import BaseButton from '../ui/BaseButton.vue';
import { toHumanReadableDate } from '../../helper/string.helper';
import CardContainer from '../ui/card/CardContainer.vue';
import RotateArrow from '../icon/RotateArrow.vue';
import BaseDropdown from '../ui/BaseDropdown.vue';
import { useToast } from '../../composables/useToast';
import { useApi } from '../../composables/api/useApi';
import { useToggleText } from '../../composables/useToggleText';
import ConfirmModal from '../ui/modal/ConfirmModal.vue';
import PdfIcon from '../icon/PdfIcon.vue';
import TrashIcon from '../icon/TrashIcon.vue';
import HtmlIcon from '../icon/HtmlIcon.vue';

interface Props {
  resume: Resume;
}

interface Emits {
  (e: 'remove'): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const { show } = useToast();
const { request, loading, apiUrl } = useApi();
const { isOpen, shouldToggle, displayText, toggle } = useToggleText(props.resume?.prompt);

const resume = computed(() => props.resume);
const templateTypes = computed(() => Object.values(BASE_TEMPLATE_TYPES));

const pdfUrl = computed(() => `${apiUrl}/resume/pdf/${props.resume.id}`);
const pageUrl = computed(() => `${apiUrl}/resume/page/${props.resume.id}`);
const showConfirmModal = ref(false);

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
</script>

<template>
  <div
    class="group border rounded-2xl px-5 pb-5 bg-white dark:bg-zinc-900 shadow-sm hover:shadow-md dark:hover:shadow-zinc-800/50 border-zinc-200 dark:border-zinc-800 transition-all duration-200"
    @click="toggle" :class="shouldToggle && 'cursor-pointer'">
    <div class="py-4 flex justify-between items-center gap-4">
      <small class="text-gray-500 dark:text-zinc-400">Criado em: {{ toHumanReadableDate(resume.createdAt ?? '')
      }}</small>

      <div class="flex items-center gap-3">
        <RotateArrow :rotate="isOpen" v-if="shouldToggle" />

        <BaseDropdown>
          <template #trigger="{ toggle: toggleDropdown, isOpen: isDropdownOpen }">
            <BaseButton @click.stop="toggleDropdown" aria-haspopup="true" :aria-expanded="isDropdownOpen" size="sm"
              variant="outline">
              <HtmlIcon />
              <RotateArrow :rotate="isDropdownOpen" />
            </BaseButton>
          </template>

          <template #default="{ close }">
            <BaseButton v-for="type in templateTypes" :key="type" :value="type" @click.stop="goToPageUrl(type, close)"
              size="sm" variant="ghost" class="dropdown-item">
              {{ capitalize(type) }}
            </BaseButton>
          </template>
        </BaseDropdown>

        <BaseButton @click.stop="goToPdfUrl" size="sm" variant="outline" :disabled="!pdfUrl">
          <PdfIcon />
        </BaseButton>

        <BaseButton @click.stop="showConfirmModal = true" size="sm" variant="destructive" :disabled="loading">
          <TrashIcon />
        </BaseButton>
      </div>
    </div>

    <CardContainer variant="text">
      {{ displayText }}
    </CardContainer>
  </div>

  <ConfirmModal :is-open="showConfirmModal" @cancel="showConfirmModal = false" @confirm="removeResume" />
</template>

<style scoped lang="postcss">
.dropdown-item {
  @apply w-full px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800 hover:text-black transition;
}
</style>

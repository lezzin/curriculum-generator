<script setup lang="ts">
import { capitalize, computed } from 'vue';
import type { BaseTemplateType } from '../../interfaces/resume.interfaces';
import { VuePDF, usePDF } from '@tato30/vue-pdf';
import CardContainer from '../ui/card/CardContainer.vue';

interface Props {
  template: BaseTemplateType;
}

const props = defineProps<Props>();

const templateUrl = computed(() => `/preview/template/${props.template}.pdf`);
const templateName = computed(() => capitalize(props.template));

const { pdf, pages } = usePDF(templateUrl);
</script>

<template>
  <CardContainer size="sm">
    <div v-if="pdf">
      <VuePDF
        v-for="page in pages"
        :key="page"
        :pdf="pdf"
        :page="page"
        :title="`Pré-visualização do template ${templateName}`"
      />
    </div>
  </CardContainer>
</template>

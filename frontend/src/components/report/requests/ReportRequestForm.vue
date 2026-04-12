<script setup lang="ts">
import { useForm } from 'vee-validate';
import { useReportRequest } from '../../../composables/useReportRequest';
import BaseButton from '../../ui/BaseButton.vue';

interface Props {
  endpoint: string;
  schema: any;
  initialValues?: any;
}

const props = defineProps<Props>();
const emit = defineEmits(['saved']);

const { submit, loading } = useReportRequest(props.endpoint);

const { handleSubmit } = useForm({
  validationSchema: props.schema,
  initialValues: props.initialValues,
});

const requestReport = handleSubmit(async (form) => {
  const success = await submit(form);
  if (!success) return;
  emit('saved');
});
</script>

<template>
  <form class="grid md:grid-cols-3 gap-2" @submit.prevent="requestReport">
    <slot />

    <div class="md:col-start-3">
      <span>&ensp;</span>
      <BaseButton type="submit" :loading="loading" class="w-full"> Solicitar </BaseButton>
    </div>
  </form>
</template>

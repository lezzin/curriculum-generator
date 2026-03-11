<script setup lang="ts">
import { watch } from 'vue';
import { useApi } from '../../composables/api/useApi';
import { useToast } from '../../composables/useToast';
import BaseButton from '../../components/ui/BaseButton.vue';
import InputField from '../../components/ui/form/InputField.vue';
import TextAreaField from '../../components/ui/form/TextAreaField.vue';
import ExperienceFields from '../../components/ui/form/ExperienceFields.vue';
import ProjectFields from '../../components/ui/form/ProjectFields.vue';
import BaseModal from '../ui/modal/BaseModal.vue';
import { useForm, useFieldArray } from 'vee-validate';
import { baseDataSchema, INITIAL_VALUES, type BaseDataForm } from '../../validation/schemas/base-data.schema';

interface Props {
  type: string | null;
  initialData: string | null;
  isOpen: boolean;
}

type Experience = {
  title: string;
  company: string;
  period: string;
  responsibilitiesString: string;
  technologiesString: string;
};

type Project = {
  name: string;
  highlightsString: string;
  technologiesString: string;
};

const props = defineProps<Props>();

const emit = defineEmits(['close', 'saved', 'update:isOpen']);

const { request, loading: isLoading } = useApi();
const { show } = useToast();

const { handleSubmit, resetForm } = useForm<BaseDataForm>({
  validationSchema: baseDataSchema,
  initialValues: INITIAL_VALUES,
});

const { fields: experienceFields, push: pushExperience, remove: removeExperience } = useFieldArray('experiences');

const { fields: projectFields, push: pushProject, remove: removeProject } = useFieldArray('projects');

const newExperience = (): Experience => ({
  title: '',
  company: '',
  period: '',
  responsibilitiesString: '',
  technologiesString: '',
});

const newProject = (): Project => ({
  name: '',
  highlightsString: '',
  technologiesString: '',
});

const initForm = () => {
  if (!props.initialData) {
    resetForm({
      values: {
        summary: '',
        skillsString: '',
        experiences: [newExperience()],
        projects: [newProject()],
      },
    });

    return;
  }

  try {
    const data = JSON.parse(props.initialData);

    resetForm({
      values: {
        summary: data.summary ?? '',
        skillsString: (data.skills ?? []).join(', '),
        experiences: (data.experiences ?? []).map((e: any) => ({
          ...e,
          responsibilitiesString: (e.responsibilities ?? []).join('\n'),
          technologiesString: (e.technologies ?? []).join(', '),
        })),
        projects: (data.projects ?? []).map((p: any) => ({
          ...p,
          highlightsString: (p.highlights ?? []).join('\n'),
          technologiesString: (p.technologies ?? []).join(', '),
        })),
      },
    });
  } catch (err) {
    console.error(err);
  }
};

watch(
  () => props.isOpen,
  (val) => {
    if (val) initForm();
  }
);

const handleClose = () => {
  emit('update:isOpen', false);
};

const save = handleSubmit(async (form) => {
  const skills = form.skillsString
    ?.split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  const experiences = form.experiences?.map((e) => ({
    title: e.title,
    company: e.company,
    period: e.period,
    responsibilities: e.responsibilitiesString
      ?.split('\n')
      .map((s) => s.trim())
      .filter(Boolean),
    technologies: e.technologiesString
      ?.split(',')
      .map((s) => s.trim())
      .filter(Boolean),
  }));

  const projects = form.projects?.map((p) => ({
    name: p.name,
    highlights: p.highlightsString
      ?.split('\n')
      .map((s) => s.trim())
      .filter(Boolean),
    technologies: p.technologiesString
      ?.split(',')
      .map((s) => s.trim())
      .filter(Boolean),
  }));

  const description = JSON.stringify({ summary: form.summary, skills, experiences, projects }, null, 2);

  const { error } = await request('post', '/base-data/upsert', {
    type: props.type,
    description,
  });

  if (!error) {
    show('Dados salvos com sucesso');
    emit('saved');
    emit('update:isOpen', false);
    return;
  }

  show({ message: error, type: 'error' });
});

const modalTitle = `Editar Base de ${props.type === 'resume' ? 'Currículo' : 'Proposta Freelance'}`;
</script>

<template>
  <BaseModal :isOpen="isOpen" :title="modalTitle" size="xl" @close="handleClose">
    <form @submit.prevent="save" id="save-base-data-form" class="space-y-6">
      <div class="space-y-4">
        <h2 class="text-lg font-bold border-b pb-2">Informações Gerais</h2>
        <TextAreaField name="summary" label="Resumo Profissional" placeholder="3-4 linhas, resultados, tecnologias" />
        <InputField name="skillsString" label="Skills" placeholder="Node.js, NestJS, PostgreSQL" />
      </div>

      <div class="space-y-4">
        <h2 class="text-lg font-bold border-b pb-2">Experiências Profissionais</h2>
        <ExperienceFields
          :fields="experienceFields"
          :on-add="() => pushExperience(newExperience())"
          :on-remove="removeExperience"
        />
      </div>

      <div class="space-y-4">
        <h2 class="text-lg font-bold border-b pb-2">Projetos em Destaque</h2>
        <ProjectFields :fields="projectFields" :on-add="() => pushProject(newProject())" :on-remove="removeProject" />
      </div>
    </form>

    <template #footer>
      <div class="flex justify-end gap-2">
        <BaseButton type="submit" :loading="isLoading" form="save-base-data-form">Salvar</BaseButton>
        <BaseButton variant="ghost" @click="handleClose">Cancelar</BaseButton>
      </div>
    </template>
  </BaseModal>
</template>

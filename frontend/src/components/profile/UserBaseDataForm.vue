<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import { useApi } from '../../composables/useApi'
import { useToast } from '../../composables/useToast'
import BaseButton from '../../components/ui/BaseButton.vue'
import InputField from '../../components/ui/form/InputField.vue'
import TextAreaField from '../../components/ui/form/TextAreaField.vue'
import BaseModal from '../ui/modal/BaseModal.vue'

type Experience = {
    title: string; company: string; period: string
    responsibilitiesString: string; technologiesString: string
}

type Project = {
    name: string
    highlightsString: string; technologiesString: string
}

const props = defineProps<{
    type: string | null
    initialData: string | null
    isOpen: boolean
}>()

const emit = defineEmits(['close', 'saved', 'update:isOpen'])

const { api, loading: isLoading } = useApi()
const { show } = useToast()

const isOpenLocal = ref(false)

const state = reactive({
    summary: '',
    skillsString: '',
    experiences: [] as Experience[],
    projects: [] as Project[],
})

const newExperience = (): Experience => ({
    title: '', company: '', period: '',
    responsibilitiesString: '', technologiesString: '',
})

const newProject = (): Project => ({
    name: '', highlightsString: '', technologiesString: '',
})

const initForm = () => {
    state.summary = ''
    state.skillsString = ''
    state.experiences = []
    state.projects = []

    if (!props.initialData) {
        state.experiences.push(newExperience())
        state.projects.push(newProject())
        return
    }

    try {
        const data = JSON.parse(props.initialData)
        state.summary = data.summary ?? ''
        state.skillsString = (data.skills ?? []).join(', ')
        state.experiences = (data.experiences ?? []).map((e: any) => ({
            ...e,
            responsibilitiesString: (e.responsibilities ?? []).join('\n'),
            technologiesString: (e.technologies ?? []).join(', '),
        }))
        state.projects = (data.projects ?? []).map((p: any) => ({
            ...p,
            highlightsString: (p.highlights ?? []).join('\n'),
            technologiesString: (p.technologies ?? []).join(', '),
        }))
    } catch (err) {
        console.error('Erro ao parsear initialData', err)
    }
}

watch(() => props.isOpen, val => {
    isOpenLocal.value = val
    if (val) initForm()
})

const handleClose = () => {
    emit('update:isOpen', false)
    emit('close')
}

const save = async () => {
    const skills = state.skillsString.split(',').map(s => s.trim()).filter(Boolean)

    const experiences = state.experiences.map(e => ({
        title: e.title, company: e.company, period: e.period,
        responsibilities: e.responsibilitiesString.split('\n').map(s => s.trim()).filter(Boolean),
        technologies: e.technologiesString.split(',').map(s => s.trim()).filter(Boolean),
    }))

    const projects = state.projects.map(p => ({
        name: p.name,
        highlights: p.highlightsString.split('\n').map(s => s.trim()).filter(Boolean),
        technologies: p.technologiesString.split(',').map(s => s.trim()).filter(Boolean),
    }))

    const description = JSON.stringify({ summary: state.summary, skills, experiences, projects }, null, 2)

    await api.post('/base-data/upsert', { type: props.type, description })
    show({ message: 'Dados salvos com sucesso', type: 'success' })
    emit('saved')
    emit('close')
}

const modalTitle = `Editar Base de ${props.type === 'resume' ? 'Currículo' : 'Proposta Freelance'}`
</script>

<template>
    <BaseModal v-model="isOpenLocal" :title="modalTitle" size="xl">
        <form @submit.prevent="save" id="save-base-data-form" class="space-y-4">
            <TextAreaField label="Resumo Profissional" v-model="state.summary" :rows="4"
                placeholder="3-4 linhas, resultados, tecnologias" />
            <InputField label="Skills / Tecnologias (vírgula separada)" v-model="state.skillsString"
                placeholder="Node.js, NestJS, PostgreSQL" />

            <div v-for="(exp, i) in state.experiences" :key="i" class="border p-4 rounded-md space-y-2">
                <h3 class="font-semibold">Experiência {{ i + 1 }}</h3>
                <InputField label="Cargo" v-model="exp.title" />
                <InputField label="Empresa" v-model="exp.company" />
                <InputField label="Período" v-model="exp.period" placeholder="Jan 2020 - Dez 2022" />
                <TextAreaField label="Responsabilidades (uma por linha)" v-model="exp.responsibilitiesString"
                    :rows="3" />
                <InputField label="Tecnologias (vírgula separada)" v-model="exp.technologiesString" />
            </div>
            <BaseButton type="button" variant="ghost" @click="state.experiences.push(newExperience())">
                + Adicionar Experiência
            </BaseButton>

            <div v-for="(proj, i) in state.projects" :key="i" class="border p-4 rounded-md space-y-2">
                <h3 class="font-semibold">Projeto {{ i + 1 }}</h3>
                <InputField label="Nome do projeto" v-model="proj.name" />
                <TextAreaField label="Destaques (uma por linha)" v-model="proj.highlightsString" :rows="3" />
                <InputField label="Tecnologias (vírgula separada)" v-model="proj.technologiesString" />
            </div>
            <BaseButton type="button" variant="ghost" @click="state.projects.push(newProject())">
                + Adicionar Projeto
            </BaseButton>
        </form>

        <template #footer>
            <div class="flex justify-end gap-2">
                <BaseButton type="submit" :loading="isLoading" form="save-base-data-form">Salvar</BaseButton>
                <BaseButton variant="ghost" @click="handleClose">Cancelar</BaseButton>
            </div>
        </template>
    </BaseModal>
</template>
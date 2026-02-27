<script setup lang="ts">
import { onMounted, reactive, computed, ref } from 'vue'
import { useApi } from '../../composables/useApi'
import { useProfileValidation } from '../../composables/useProfileValidation'
import SelectField from '../../components/ui/form/SelectField.vue'
import BaseButton from '../../components/ui/BaseButton.vue'
import TextAreaField from '../../components/ui/form/TextAreaField.vue'
import { useToast } from '../../composables/useToast'
import BaseModal from '../ui/modal/BaseModal.vue'
import BaseDataCard from './BaseDataCard.vue'

const BASE_TYPES = {
    RESUME: 'resume',
    FREELANCE_PROPOSAL: 'freelance-proposal',
} as const

type BaseType = typeof BASE_TYPES[keyof typeof BASE_TYPES]

type BaseDataItem = {
    id: string
    description: string
    type: BaseType
    userId: string
    createdAt: string
}

const typeLabels: Record<BaseType, string> = {
    'resume': 'Currículo',
    'freelance-proposal': 'Proposta Freelance'
}

const state = reactive({
    type: BASE_TYPES.RESUME as BaseType,
    description: '',
})

const baseData = reactive<Record<BaseType, string | null>>({
    resume: null,
    'freelance-proposal': null,
})

const { errors, validateRequired, validateDescription, isFormValid } = useProfileValidation(state)
const { api, loading: isLoading } = useApi()
const { show } = useToast();

const isModalOpen = ref(false)
const editingType = ref<BaseType | null>(null)

const types = computed(() => Object.values(BASE_TYPES))

const loadBaseData = async () => {
    try {
        const { data } = await api.get<BaseDataItem[]>('/base-data/all')

        const resumeItem = data.find(item => item.type === BASE_TYPES.RESUME)
        const freelanceItem = data.find(item => item.type === BASE_TYPES.FREELANCE_PROPOSAL)

        baseData[BASE_TYPES.RESUME] = resumeItem?.description ?? null
        baseData[BASE_TYPES.FREELANCE_PROPOSAL] = freelanceItem?.description ?? null
    } catch (err) {
        console.error(err)
        show('Erro ao carregar base data:')
    }
}

const createBaseData = async () => {
    validateRequired("type", state.type)
    validateRequired("description", state.description)
    validateDescription()

    if (!isFormValid.value) return

    await api.post('/base-data/upsert', {
        type: state.type,
        description: state.description,
    })

    await loadBaseData()
    closeEditModal()
}

const removeBaseData = async (type: BaseType) => {
    await api.post('/base-data/remove', { type })
    baseData[type] = null
}

const openEditModal = (type: BaseType) => {
    editingType.value = type
    state.type = type
    state.description = baseData[type] ?? ''
    isModalOpen.value = true
}

const closeEditModal = () => {
    isModalOpen.value = false
}

onMounted(loadBaseData)
</script>

<template>
    <BaseModal v-model="isModalOpen" title="Editar Base de Currículo" size="lg">
        <form class="space-y-4" @submit.prevent="createBaseData" id="save-base-data-form">
            <p class="text-sm text-gray-600">
                Quanto mais detalhado você for aqui, melhores serão os conteúdos gerados automaticamente.
            </p>

            <SelectField label="Tipo de informação base" v-model="state.type" :error="errors.type">
                <option disabled value="">Selecione uma opção</option>
                <option v-for="type in types" :key="type" :value="type">
                    {{ typeLabels[type] }}
                </option>
            </SelectField>

            <TextAreaField label="Descrição base" v-model="state.description" :rows="10" placeholder="Exemplo:
Sou desenvolvedor backend com 3 anos de experiência em Node.js e NestJS.
Atuo com arquitetura limpa, APIs REST, integração com pagamentos e filas.
Tenho experiência com PostgreSQL, Redis e AWS.
Busco oportunidades como desenvolvedor backend pleno." :error="errors.description"
                @blur="validateRequired('description', state.description)" />
        </form>

        <template #footer>
            <div class="flex justify-end gap-2">
                <BaseButton variant="ghost" @click="closeEditModal">
                    Cancelar
                </BaseButton>

                <BaseButton type="submit" form="save-base-data-form" :disabled="isLoading || !state.description.trim()"
                    :loading="isLoading">
                    Salvar informações base
                </BaseButton>
            </div>
        </template>
    </BaseModal>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <BaseDataCard title="Base de Informações para Currículos"
            description="Essas informações servirão como contexto principal para gerar seus currículos automaticamente."
            :content="baseData.resume" @edit="openEditModal(BASE_TYPES.RESUME)"
            @remove="removeBaseData(BASE_TYPES.RESUME)" />

        <BaseDataCard title="Base para Propostas Freelance"
            description="Utilizada como contexto para gerar propostas personalizadas para clientes."
            :content="baseData['freelance-proposal']" @edit="openEditModal(BASE_TYPES.FREELANCE_PROPOSAL)"
            @remove="removeBaseData(BASE_TYPES.FREELANCE_PROPOSAL)" />
    </div>
</template>
<script setup lang="ts">
import { onMounted, reactive, computed } from 'vue'
import CardContainer from '../../components/ui/card/CardContainer.vue'
import { useApi } from '../../composables/useApi'
import { useAuth } from '../../composables/useAuth'
import { useProfileValidation } from '../../composables/useProfileValidation'
import SelectField from '../../components/ui/form/SelectField.vue'
import BaseButton from '../../components/ui/BaseButton.vue'
import TextAreaField from '../../components/ui/form/TextAreaField.vue'
import AppTitle from '../../components/layout/AppTitle.vue'
import UserAvatar from '../../components/ui/UserAvatar.vue'
import { useToast } from '../../composables/useToast'

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

const { errors, validateRequired, isFormValid } = useProfileValidation(state)
const { api, loading: isLoading } = useApi()
const { user } = useAuth()
const { show } = useToast();

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

    if (!isFormValid.value) return

    await api.post('/base-data/upsert', {
        type: state.type,
        description: state.description,
    })

    await loadBaseData()

    state.description = ''
}

const removeBaseData = async (type: BaseType) => {
    await api.post('/base-data/remove', { type })
    baseData[type] = null
}

onMounted(loadBaseData)
</script>

<template>
    <AppTitle title="Perfil do Usuário"
        subtitle="Gerencie aqui as informações base utilizadas na geração de currículos e propostas personalizadas." />

    <header class="flex items-center gap-4 mb-6">
        <UserAvatar v-if="user?.name" :name="user.name" />

        <div class="flex flex-col">
            <p class="text-lg font-semibold">
                {{ user?.name }}
            </p>

            <p class="text-sm text-gray-600">
                {{ user?.email }}
            </p>
        </div>
    </header>

    <CardContainer>
        <form class="space-y-4" @submit.prevent="createBaseData">
            <SelectField label="Tipo de informação base" v-model="state.type" :error="errors.type">
                <option disabled value="">Selecione uma opção</option>
                <option v-for="type in types" :key="type" :value="type">
                    {{ typeLabels[type] }}
                </option>
            </SelectField>

            <TextAreaField label="Descrição base" v-model="state.description" :rows="10"
                placeholder="Insira aqui as informações principais que servirão como base para gerar seus conteúdos (experiência, habilidades, diferenciais, etc.)."
                :error="errors.description" @blur="validateRequired('description', state.description)"
                :show-length="false" />

            <BaseButton type="submit" class="w-full" :disabled="isLoading || !state.description.trim()"
                :loading="isLoading">
                Salvar informações base
            </BaseButton>
        </form>
    </CardContainer>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <CardContainer class="space-y-4">
            <h2 class="font-semibold">Base para Currículos</h2>

            <CardContainer variant="text" size="sm" class="h-80 overflow-y-auto whitespace-pre-wrap">
                {{ baseData.resume ?? 'Nenhuma informação cadastrada.' }}
            </CardContainer>

            <BaseButton v-if="baseData.resume" variant="destructive" size="sm"
                @click="removeBaseData(BASE_TYPES.RESUME)">
                Remover informações
            </BaseButton>
        </CardContainer>

        <CardContainer class="space-y-4">
            <h2 class="font-semibold">Base para Propostas Freelance</h2>

            <CardContainer variant="text" size="sm" class="h-80 overflow-y-auto whitespace-pre-wrap">
                {{ baseData['freelance-proposal'] ?? 'Nenhuma informação cadastrada.' }}
            </CardContainer>

            <BaseButton v-if="baseData['freelance-proposal']" variant="destructive" size="sm"
                @click="removeBaseData(BASE_TYPES.FREELANCE_PROPOSAL)">
                Remover informações
            </BaseButton>
        </CardContainer>
    </div>
</template>
<script setup lang="ts">
import { onMounted, reactive, computed } from 'vue'
import CardContainer from '../components/ui/card/CardContainer.vue'
import { useApi } from '../composables/useApi'
import { useAuth } from '../composables/useAuth'
import { useProfileValidation } from '../composables/useProfileValidation'
import SelectField from '../components/ui/form/SelectField.vue'
import BaseButton from '../components/ui/BaseButton.vue'
import TextAreaField from '../components/ui/form/TextAreaField.vue'

const BASE_TYPES = {
    RESUME: 'resume',
    FREELANCE_PROPOSAL: 'freelance-proposal',
} as const

type BaseType = typeof BASE_TYPES[keyof typeof BASE_TYPES]

const typeLabels: Record<BaseType, string> = {
    'resume': 'Currículo',
    'freelance-proposal': 'Proposta Freelance'
}

type BaseDataResponse = {
    type: BaseType
    data: string | null
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

const types = computed(() => Object.values(BASE_TYPES))

const loadBaseData = async () => {
    const { data } = await api.get<BaseDataResponse[]>('/base/all')

    for (const item of data) {
        baseData[item.type] = item.data
    }
}

const createBaseData = async () => {
    validateRequired("type", state.type)
    validateRequired("description", state.description)

    if (!isFormValid.value) return

    await api.post('/base/create', {
        type: state.type,
        description: state.description,
    })

    await loadBaseData()

    state.description = ''
}

const removeBaseData = async (type: BaseType) => {
    await api.post('/base/remove', { type })
    baseData[type] = null
}

onMounted(loadBaseData)
</script>

<template>
    <header class="flex flex-col mb-6">
        <p class="text-lg font-semibold">{{ user?.name }}</p>
        <p class="text-sm text-gray-500">{{ user?.email }}</p>
    </header>

    <CardContainer>
        <form class="space-y-4" @submit.prevent="createBaseData">
            <SelectField label="Tipo de dado base" v-model="state.type" :error="errors.type">
                <option disabled value="">Selecione</option>
                <option v-for="type in types" :key="type" :value="type">
                    {{ typeLabels[type] }}
                </option>
            </SelectField>

            <TextAreaField label="Descrição" v-model="state.description" :rows="10"
                placeholder="Cole a descrição base para os modelos de IA..." :error="errors.description"
                @blur="validateRequired('description', state.description)" :show-length="false" />

            <BaseButton type="submit" class="w-full" :disabled="isLoading || !state.description.trim()"
                :loading="isLoading">
                Salvar
            </BaseButton>
        </form>
    </CardContainer>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <CardContainer class="space-y-4">
            <h2 class="font-semibold">Currículo</h2>

            <CardContainer variant="text" size="sm" class="min-h-24 whitespace-pre-wrap">
                {{ baseData.resume ?? 'Sem dados' }}
            </CardContainer>

            <BaseButton v-if="baseData.resume" variant="destructive" size="sm"
                @click="removeBaseData(BASE_TYPES.RESUME)">
                Remover
            </BaseButton>
        </CardContainer>

        <CardContainer class="space-y-4">
            <h2 class="font-semibold">Propostas Freelance</h2>

            <CardContainer variant="text" size="sm" class="min-h-24 whitespace-pre-wrap">
                {{ baseData['freelance-proposal'] ?? 'Sem dados' }}
            </CardContainer>

            <BaseButton v-if="baseData['freelance-proposal']" variant="destructive" size="sm"
                @click="removeBaseData(BASE_TYPES.FREELANCE_PROPOSAL)">
                Remover
            </BaseButton>
        </CardContainer>
    </div>
</template>
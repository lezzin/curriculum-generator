<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { useApi } from '../../composables/useApi'
import { useToast } from '../../composables/useToast'
import BaseDataCard from './BaseDataCard.vue'
import UserBaseDataForm from './UserBaseDataForm.vue'

type UserBaseType = 'resume' | 'freelance-proposal'

type UserBaseDataItem = {
    id: string
    type: UserBaseType
    description: string
    userId: string
    createdAt: string
}

const { request } = useApi()
const { show } = useToast()

const baseData = reactive<Record<UserBaseType, string | null>>({
    resume: null,
    'freelance-proposal': null,
})

const isModalOpen = ref(false)
const editingType = ref<UserBaseType>('resume')

const loadBaseData = async () => {
    try {
        const data = await request<UserBaseDataItem[]>('get', '/base-data/all')
        baseData.resume = data?.find(d => d.type === 'resume')?.description ?? null
        baseData['freelance-proposal'] = data?.find(d => d.type === 'freelance-proposal')?.description ?? null
    } catch {
        show({ message: 'Erro ao carregar dados base.', type: 'error' })
    }
}

const openForm = (type: UserBaseType) => {
    editingType.value = type
    isModalOpen.value = true
}

const removeBaseData = async (type: UserBaseType) => {
    try {
        await request('post', '/base-data/remove', { type })
        baseData[type] = null
        show({ message: 'Base removida com sucesso.', type: 'success' })
    } catch {
        show({ message: 'Erro ao remover base.', type: 'error' })
    }
}

const handleSaved = async () => {
    await loadBaseData()
}

onMounted(loadBaseData)
</script>

<template>
    <UserBaseDataForm v-model:isOpen="isModalOpen" :type="editingType" :initialData="baseData[editingType]"
        @saved="handleSaved" />

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <BaseDataCard title="Base de Informações para Currículos"
            description="Essas informações servirão como contexto principal para gerar seus currículos automaticamente."
            :content="baseData.resume" @edit="openForm('resume')" @remove="removeBaseData('resume')" />

        <BaseDataCard title="Base para Propostas Freelance"
            description="Utilizada como contexto para gerar propostas personalizadas para clientes."
            :content="baseData['freelance-proposal']" @edit="openForm('freelance-proposal')"
            @remove="removeBaseData('freelance-proposal')" />
    </div>
</template>
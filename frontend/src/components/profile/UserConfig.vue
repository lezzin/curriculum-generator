<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import CardContainer from '../../components/ui/card/CardContainer.vue'
import { useApi } from '../../composables/useApi'
import BaseButton from '../../components/ui/BaseButton.vue'
import { useToast } from '../../composables/useToast'
import InputField from '../ui/form/InputField.vue'
import { nullToEmpty } from '../../helper/string.helper'
import { useForm } from 'vee-validate'
import { userConfigSchema, type UserConfigForm } from '../validation/schemas/user-config.schema'

interface UserConfig {
    linkedin: string
    github: string
    portfolio: string
    cellphone: string
}

const { handleSubmit, resetForm, values } = useForm<UserConfigForm>({
    validationSchema: userConfigSchema
})

const userConfig = ref<UserConfig | null>(null)

const { api, loading: isLoading } = useApi()
const { show } = useToast()

const completionPercentage = computed(() => {
    const total = Object.keys(values).length
    const filled = Object.values(values).filter(v => v?.trim()?.length || 0 > 0).length
    return Math.round((filled / total) * 100)
})

const loadUserConfig = async () => {
    try {
        const { data } = await api.get('/user-config/all')
        const normalized = nullToEmpty(data)

        resetForm({
            values: {
                linkedin: normalized.linkedin,
                github: normalized.github,
                portfolio: normalized.portfolio,
                cellphone: normalized.cellphone
            }
        })

        userConfig.value = data
    } catch (err: any) {
        show({
            message: err.message || 'Erro ao carregar configurações.',
            type: 'error'
        })
    }
}

const upsertUserConfigData = handleSubmit(async (form) => {
    try {
        await api.post('/user-config/upsert', form)
        await loadUserConfig()
        show('Informações atualizadas com sucesso!')
    } catch (err: any) {
        show({
            message: err.message || 'Erro ao salvar configurações.',
            type: 'error'
        })
    }
})

onMounted(loadUserConfig)
</script>

<template>
    <CardContainer class="space-y-6">
        <div class="space-y-2">
            <div class="flex justify-between items-center">
                <h2 class="text-lg font-semibold">
                    Informações Públicas
                </h2>

                <span class="text-xs bg-gray-200 px-2 py-1 rounded-full">
                    Perfil {{ completionPercentage }}% completo
                </span>
            </div>

            <p class="text-sm text-gray-600">
                Esses dados serão utilizados na geração automática de currículos e propostas.
                Preencha apenas o que desejar exibir.
            </p>
        </div>

        <form class="space-y-6" @submit.prevent="upsertUserConfigData">
            <div class="grid md:grid-cols-2 gap-4">
                <InputField label="Telefone" name="cellphone" placeholder="(35) 99999-9999"
                    helper=" Número que poderá aparecer em seus documentos." />

                <InputField label="LinkedIn" name="linkedin" placeholder=" https://linkedin.com/in/seu-usuario"
                    helper="Link público do seu perfil profissional." />
            </div>

            <div class="grid md:grid-cols-2 gap-4">
                <InputField label="GitHub" name="github" placeholder="https://github.com/seu-usuario"
                    helper=" Repositórios e projetos públicos." />

                <InputField label="Portfólio" name="portfolio" placeholder="https://seuportfolio.com"
                    helper="Site pessoal ou página com seus trabalhos." />
            </div>

            <BaseButton type="submit" class="w-full" :disabled="isLoading" :loading="isLoading">
                {{ isLoading ? 'Salvando...' : 'Salvar alterações' }}
            </BaseButton>
        </form>
    </CardContainer>
</template>
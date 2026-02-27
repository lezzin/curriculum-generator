<script setup lang="ts">
import { onMounted, reactive, ref, computed } from 'vue'
import CardContainer from '../../components/ui/card/CardContainer.vue'
import { useApi } from '../../composables/useApi'
import BaseButton from '../../components/ui/BaseButton.vue'
import { useToast } from '../../composables/useToast'
import InputField from '../ui/form/InputField.vue'
import { useConfigValidation } from '../../composables/useConfigValidation'

interface UserConfig {
    linkedin: string
    github: string
    portfolio: string
    cellphone: string
}

const state = reactive<UserConfig>({
    linkedin: "",
    github: "",
    portfolio: "",
    cellphone: "",
})

const userConfig = ref<UserConfig | null>(null)

const { api, loading: isLoading } = useApi()
const { errors, isFormValid, validateUrl, validatePhone } = useConfigValidation(state)
const { show } = useToast()

const completionPercentage = computed(() => {
    const total = Object.keys(state).length
    const filled = Object.values(state).filter(v => v.trim().length > 0).length
    return Math.round((filled / total) * 100)
})

const loadUserConfig = async () => {
    try {
        const { data } = await api.get('/user-config/all')
        Object.assign(state, data)
        userConfig.value = data
    } catch (err) {
        console.error(err)
        show('Erro ao carregar configurações.')
    }
}

const upsertUserConfigData = async () => {
    if (!isFormValid.value) return

    try {
        await api.post('/user-config/upsert', { ...state })
        await loadUserConfig()
        show('Informações atualizadas com sucesso!')
    } catch (err) {
        console.error(err)
        show('Erro ao salvar configurações.')
    }
}

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
                <div>
                    <InputField label="Telefone" v-model="state.cellphone" :error="errors.cellphone"
                        placeholder="(35) 99999-9999" @blur="validatePhone(state.cellphone)" />
                    <p class="text-xs text-gray-500 mt-1">
                        Número que poderá aparecer em seus documentos.
                    </p>
                </div>

                <div>
                    <InputField label="LinkedIn" v-model="state.linkedin" :error="errors.linkedin"
                        placeholder="https://linkedin.com/in/seu-usuario"
                        @blur="validateUrl('linkedin', state.linkedin)" />
                    <p class="text-xs text-gray-500 mt-1">
                        Link público do seu perfil profissional.
                    </p>
                </div>
            </div>

            <div class="grid md:grid-cols-2 gap-4">
                <div>
                    <InputField label="GitHub" v-model="state.github" :error="errors.github"
                        placeholder="https://github.com/seu-usuario" @blur="validateUrl('github', state.github)" />
                    <p class="text-xs text-gray-500 mt-1">
                        Repositórios e projetos públicos.
                    </p>
                </div>

                <div>
                    <InputField label="Portfólio" v-model="state.portfolio" :error="errors.portfolio"
                        placeholder="https://seuportfolio.com" @blur="validateUrl('portfolio', state.portfolio)" />
                    <p class="text-xs text-gray-500 mt-1">
                        Site pessoal ou página com seus trabalhos.
                    </p>
                </div>
            </div>

            <BaseButton type="submit" class="w-full" :disabled="isLoading" :loading="isLoading">
                {{ isLoading ? 'Salvando...' : 'Salvar alterações' }}
            </BaseButton>
        </form>
    </CardContainer>
</template>
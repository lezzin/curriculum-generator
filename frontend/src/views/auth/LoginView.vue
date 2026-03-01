<script setup lang="ts">
import { useForm } from 'vee-validate'
import { useRouter } from 'vue-router'
import { useApi } from '../../composables/useApi'
import { useToast } from '../../composables/useToast'
import { useAuth } from '../../composables/useAuth'
import AppTitle from '../../components/layout/AppTitle.vue'
import CardContainer from '../../components/ui/card/CardContainer.vue'
import BaseButton from '../../components/ui/BaseButton.vue'
import InputField from '../../components/ui/form/InputField.vue'
import { authSchema, type AuthForm } from '../../components/validation/schemas/auth.schema'

const { handleSubmit } = useForm<AuthForm>({
    validationSchema: authSchema
})

const router = useRouter()
const { request, api, loading } = useApi()
const { show } = useToast()
const { checkAuth } = useAuth()

const login = handleSubmit(async (form) => {
    try {
        await request(() => api.post('/auth/login', form))
        show('Logado com sucesso!')
        checkAuth()
        router.push('/')
    } catch (err: any) {
        show({
            message: err.message || 'Erro ao fazer login.',
            type: 'error',
        });
    }
})
</script>

<template>
    <CardContainer class="max-w-lg mx-auto" size="lg">
        <form class="space-y-4" @submit.prevent="login">
            <AppTitle title="Bem-vindo de volta!" subtitle="Faça login para continuar" />

            <InputField label="Email" name="email" type="email" />
            <InputField label="Senha" name="password" type="password" />

            <BaseButton type="submit" :disabled="loading" :loading="loading" class="w-full">
                Login
            </BaseButton>

            <router-link to="/auth/signup" class="text-center block text-sm text-blue-500 hover:underline">
                Não tem uma conta? Cadastre-se
            </router-link>
        </form>
    </CardContainer>
</template>
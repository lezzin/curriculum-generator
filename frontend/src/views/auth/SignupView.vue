<script setup lang="ts">
import { watch } from 'vue'
import { useForm } from 'vee-validate'
import { useRouter } from 'vue-router'
import { useApi } from '../../composables/useApi'
import { useToast } from '../../composables/useToast'
import { useAuth } from '../../composables/useAuth'

import BaseButton from '../../components/ui/BaseButton.vue'
import InputField from '../../components/ui/form/InputField.vue'
import AppTitle from '../../components/layout/AppTitle.vue'
import CardContainer from '../../components/ui/card/CardContainer.vue'

import { signupSchema, type SignUpForm } from '../../components/validation/schemas/signup.schema'

const { handleSubmit } = useForm<SignUpForm>({
    validationSchema: signupSchema
})

const router = useRouter()
const { user, checkAuth } = useAuth()
const { request, api, loading } = useApi()
const { show } = useToast()

const signup = handleSubmit(async (form) => {
    try {
        await request(() =>
            api.post('/user/create', form)
        )

        await checkAuth()
        router.replace('/')
    } catch (err: any) {
        const message =
            err.response?.status === 409
                ? 'Este email já está cadastrado.'
                : 'Não foi possível criar sua conta. Tente novamente.'

        show({
            message,
            type: 'error'
        })
    }
})

watch(user, (value) => {
    if (value) {
        router.replace('/')
    }
}, { immediate: true })
</script>

<template>
    <CardContainer class="max-w-lg mx-auto" size="lg">
        <form class="space-y-5" @submit.prevent="signup">
            <AppTitle title="Crie sua conta 🚀" subtitle="Leva menos de 1 minuto para começar" />

            <InputField label="Nome de usuário" name="name" type="text" autocomplete="username" :disabled="loading"
                placeholder="Lezzin" />
            <InputField label="Email" name="email" type="email" autocomplete="email" :disabled="loading"
                placeholder="lezzin@gmail.com" />
            <InputField label="Senha" name="password" type="password" autocomplete="new-password" :disabled="loading"
                placeholder="********" />

            <BaseButton type="submit" class="w-full" :loading="loading" :disabled="loading">
                Criar conta
            </BaseButton>

            <router-link to="/auth/login"
                class="text-center block text-sm text-gray-500 hover:text-blue-500 transition">
                Já tem uma conta?
                <span class="font-medium">Faça login</span>
            </router-link>
        </form>
    </CardContainer>
</template>
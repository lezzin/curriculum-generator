<script setup lang="ts">
import { ref } from 'vue'
import { useForm } from 'vee-validate'
import { useRoute, useRouter } from 'vue-router'
import { useApi } from '../../composables/useApi'
import { useToast } from '../../composables/useToast'

import AppTitle from '../../components/layout/AppTitle.vue'
import CardContainer from '../../components/ui/card/CardContainer.vue'
import BaseButton from '../../components/ui/BaseButton.vue'
import InputField from '../../components/ui/form/InputField.vue'
import GoogleIcon from '../../components/icon/GoogleIcon.vue'
import GitHubIcon from '../../components/icon/GitHubIcon.vue'

import { authSchema, type AuthForm } from '../../validation/schemas/auth.schema'
import { useAuthStore } from '../../stores/auth'

const { handleSubmit } = useForm<AuthForm>({
    validationSchema: authSchema
})

const router = useRouter()
const route = useRoute()

const { request, loading, apiUrl } = useApi()
const { show } = useToast()

const authStore = useAuthStore()

const redirecting = ref(false)

const login = handleSubmit(async (form) => {
    const { error } = await request<string>('post', '/auth/login', form)

    if (!error) {
        await authStore.checkAuth()
        const redirect = route.query.redirect as string
        router.push(redirect || { name: 'Home' })
        return
    }

    show({ message: error, type: 'error' })
})

const loginProvider = (provider: 'github' | 'google') => {
    redirecting.value = true
    window.location.assign(`${apiUrl}/auth/${provider}`)
}
</script>

<template>
    <CardContainer class="max-w-lg mx-auto" size="lg">
        <form class="space-y-5" @submit.prevent="login">
            <AppTitle title="Bem-vindo de volta 👋" subtitle="Entre na sua conta para continuar" />

            <InputField label="Email" name="email" type="email" autocomplete="email" :disabled="loading"
                placeholder="Lezzin" />
            <InputField label="Senha" name="password" type="password" autocomplete="current-password"
                placeholder="********" :disabled="loading" />

            <BaseButton type="submit" class="w-full" :loading="loading" :disabled="loading || redirecting">
                Entrar
            </BaseButton>

            <div class="relative my-4">
                <div class="absolute inset-0 flex items-center">
                    <div class="w-full border-t border-gray-200"></div>
                </div>
                <div class="relative flex justify-center text-sm">
                    <span class="bg-white px-2 text-gray-500">
                        ou continue com
                    </span>
                </div>
            </div>

            <BaseButton type="button" variant="outline" class="w-full" :disabled="loading || redirecting"
                @click="loginProvider('google')">
                <GoogleIcon class="w-5 h-5 mr-2" />
                Continuar com Google
            </BaseButton>

            <BaseButton type="button" variant="outline" class="w-full" :disabled="loading || redirecting"
                @click="loginProvider('github')">
                <GitHubIcon class="w-5 h-5 mr-2" />
                Continuar com GitHub
            </BaseButton>

            <router-link to="/auth/signup"
                class="text-center block text-sm text-gray-500 hover:text-blue-500 transition">
                Não tem uma conta? <span class="font-medium">Cadastre-se</span>
            </router-link>
        </form>
    </CardContainer>
</template>
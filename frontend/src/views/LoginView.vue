<script setup lang="ts">
import { onMounted, reactive, watch } from 'vue';
import { useApi } from '../composables/useApi';
import { useToast } from '../composables/useToast';
import BaseButton from '../components/ui/BaseButton.vue';
import InputField from '../components/ui/form/InputField.vue';
import AppTitle from '../components/layout/AppTitle.vue';
import { useAuth } from '../composables/useAuth';
import { useAuthValidation } from '../composables/useAuthValidation';
import { useRouter } from 'vue-router';

const state = reactive({
    email: '',
    password: '',
});

const router = useRouter();

const { errors, validateRequired, isFormValid } = useAuthValidation(state);
const { setToken, isAuthenticated } = useAuth();

const { request, api, loading: isLoading } = useApi();
const { show } = useToast();

const login = async () => {
    if (!isFormValid.value) return;

    try {
        const response = await request(() =>
            api.post('/auth/login', {
                email: state.email,
                password: state.password,
            })
        );

        setToken(response.data.token);
        show('Logado com sucesso!');
        router.push('/');
    } catch (err: any) {
        show({
            message: err.message || 'Erro ao fazer login.',
            type: 'error',
        });
    }
};

watch(() => state.email, v => validateRequired('email', v));
watch(() => state.password, v => validateRequired('password', v));

onMounted(() => {
    if (isAuthenticated.value) {
        router.push('/');
    }
})
</script>

<template>
    <div class="max-w-lg mx-auto p-8 rounded-lg shadow-sm border">
        <form class="space-y-4" @submit.prevent="login()">
            <AppTitle title="Bem-vindo de volta!" subtitle="Faça login para continuar" />

            <InputField label="Email" v-model="state.email" placeholder="Email" type="email" :error="errors.email" />

            <InputField label="Senha" v-model="state.password" type="password" placeholder="Senha"
                :error="errors.password" />

            <BaseButton type="submit" :disabled="!isFormValid || isLoading" :loading="isLoading" class="w-full">
                Login
            </BaseButton>

            <router-link to="/auth/signup" class="text-center block text-sm text-blue-500 hover:underline">
                Não tem uma conta? Cadastre-se
            </router-link>
        </form>
    </div>
</template>
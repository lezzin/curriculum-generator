<script setup lang="ts">
import { onMounted, reactive, watch } from 'vue';
import { useApi } from '../../composables/useApi';
import { useToast } from '../../composables/useToast';
import BaseButton from '../../components/ui/BaseButton.vue';
import InputField from '../../components/ui/form/InputField.vue';
import AppTitle from '../../components/layout/AppTitle.vue';
import { useAuth } from '../../composables/useAuth';
import { useAuthValidation } from '../../composables/useAuthValidation';
import { useRouter } from 'vue-router';
import CardContainer from '../../components/ui/card/CardContainer.vue';

const state = reactive({
    email: '',
    password: '',
    username: '',
});

const router = useRouter();

const { errors, validateRequired, isFormValid } = useAuthValidation(state);
const { user, checkAuth } = useAuth();

const { request, api, loading: isLoading } = useApi();
const { show } = useToast();

const signup = async () => {
    if (!isFormValid.value) return;

    try {
        await request(() =>
            api.post('/user/create', {
                name: state.username,
                email: state.email,
                password: state.password,
            })
        );

        show('Conta criada com sucesso!');
        checkAuth();
        router.push('/');
    } catch (err: any) {
        show({
            message: err.message || 'Erro ao criar conta.',
            type: 'error',
        });
    }
};

watch(() => state.email, v => validateRequired('email', v));
watch(() => state.password, v => validateRequired('password', v));
watch(() => state.username, v => validateRequired('username', v));

onMounted(() => {
    if (user.value) {
        router.push('/');
    }
})
</script>

<template>
    <CardContainer class="max-w-lg mx-auto" size="lg">
        <form class="space-y-4" @submit.prevent="signup()">
            <AppTitle title="Crie sua conta" subtitle="Preencha os dados abaixo" />

            <InputField label="Nome de Usuário" v-model="state.username" placeholder="Nome de Usuário"
                :error="errors.username" />

            <InputField label="Email" v-model="state.email" placeholder="Email" type="email" :error="errors.email" />

            <InputField label="Senha" v-model="state.password" type="password" placeholder="Senha"
                :error="errors.password" />

            <BaseButton type="submit" :disabled="!isFormValid || isLoading" :loading="isLoading" class="w-full">
                Criar Conta
            </BaseButton>

            <router-link to="/auth/login" class="text-center block text-sm text-blue-500 hover:underline">
                Já tem uma conta? Faça login
            </router-link>
        </form>
    </CardContainer>
</template>
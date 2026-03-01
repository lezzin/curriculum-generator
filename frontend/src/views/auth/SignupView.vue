<script setup lang="ts">
import { onMounted } from 'vue';
import { useApi } from '../../composables/useApi';
import { useToast } from '../../composables/useToast';
import BaseButton from '../../components/ui/BaseButton.vue';
import InputField from '../../components/ui/form/InputField.vue';
import AppTitle from '../../components/layout/AppTitle.vue';
import { useAuth } from '../../composables/useAuth';
import { useRouter } from 'vue-router';
import CardContainer from '../../components/ui/card/CardContainer.vue';
import { useForm } from 'vee-validate';
import { signupSchema, type SignUpForm } from '../../components/validation/schemas/signup.schema';

const { handleSubmit } = useForm<SignUpForm>({
    validationSchema: signupSchema
})

const router = useRouter();

const { user, checkAuth } = useAuth();

const { request, api, loading: isLoading } = useApi();
const { show } = useToast();

const signup = handleSubmit(async (form) => {
    try {
        await request(() =>
            api.post('/user/create', form)
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
});

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

            <InputField label="Nome de usuário" name="name" type="username" />
            <InputField label="Email" name="email" type="email" />
            <InputField label="Senha" name="password" type="password" />

            <BaseButton type="submit" :disabled="isLoading" :loading="isLoading" class="w-full">
                Criar Conta
            </BaseButton>

            <router-link to="/auth/login" class="text-center block text-sm text-blue-500 hover:underline">
                Já tem uma conta? Faça login
            </router-link>
        </form>
    </CardContainer>
</template>
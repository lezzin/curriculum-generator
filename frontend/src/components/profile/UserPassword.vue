<script setup lang="ts">
import { useForm } from 'vee-validate';
import { useApi } from '../../composables/useApi';
import { setPasswordSchema, type SetPasswordForm } from '../validation/schemas/set-password.schema';
import { useToast } from '../../composables/useToast';
import InputField from '../ui/form/InputField.vue';
import BaseButton from '../ui/BaseButton.vue';
import CardContainer from '../ui/card/CardContainer.vue';

const { request, loading } = useApi();
const { show } = useToast();

const { handleSubmit } = useForm<SetPasswordForm>({
    validationSchema: setPasswordSchema
});

const submit = handleSubmit(async (form) => {
    try {
        await request('post', '/auth/set-password', form);
        show('Senha definida com sucesso!');
    } catch (err: any) {
        show({
            message: err.message || 'Erro ao salvar senha.',
            type: 'error'
        });
    }
});
</script>

<template>
    <CardContainer>
        <form @submit.prevent="submit" class="space-y-4">
            <div>
                <h2 class="text-xl font-semibold text-gray-800">
                    Definir senha
                </h2>
                <p class="text-sm text-gray-500 mt-1">
                    Você entrou com login social. Defina uma senha para poder acessar também com e-mail.
                </p>
            </div>

            <InputField name="password" label="Nova senha" type="password" autocomplete="new-password"
                placeholder="********" />

            <BaseButton type="submit" class="w-full" :disabled="loading">
                <span v-if="!loading">Registrar senha</span>
                <span v-else>Salvando...</span>
            </BaseButton>
        </form>
    </CardContainer>
</template>
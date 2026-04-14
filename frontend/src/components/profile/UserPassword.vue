<script setup lang="ts">
import { useForm } from 'vee-validate';
import { useApi } from '../../composables/api/useApi';
import { setPasswordSchema, type SetPasswordForm } from '../../validation/schemas/set-password.schema';
import { useToast } from '../../composables/useToast';
import InputField from '../ui/form/InputField.vue';
import BaseButton from '../ui/BaseButton.vue';
import CardContainer from '../ui/card/CardContainer.vue';
import type { User } from '../../interfaces/user.interfaces';
import { useAuthStore } from '../../stores/auth';
import { computed } from 'vue';

const { request, loading } = useApi();
const { show } = useToast();

const authStore = useAuthStore();

const { handleSubmit } = useForm<SetPasswordForm>({
  validationSchema: setPasswordSchema,
});

const submit = handleSubmit(async (form) => {
  const { error, data } = await request<User>('post', '/auth/set-password', form);

  if (error) {
    show({ message: error, type: 'error' });
    return;
  }

  show('Senha definida com sucesso!');
  authStore.setUser(data!);
});

const needsPassword = computed(() => authStore.user?.onlyProvider);
</script>

<template>
  <CardContainer>
    <div class="flex flex-col h-full">
      <form v-if="needsPassword" @submit.prevent="submit" class="flex flex-col gap-4 h-full">
        <div>
          <h2 class="text-xl font-semibold dark:text-white">
            Crie sua senha
          </h2>
          <p class="text-sm text-gray-600 dark:text-gray-300 mt-1">
            Você entrou com login social. Crie uma senha para acessar também com e-mail.
          </p>
        </div>

        <InputField name="password" label="Nova senha" type="password" autocomplete="new-password"
          placeholder="********" />

        <BaseButton type="submit" class="w-full mt-auto" :disabled="loading">
          <span v-if="!loading">Criar senha</span>
          <span v-else>Salvando...</span>
        </BaseButton>
      </form>

      <div v-else class="flex flex-col gap-4 h-full justify-center items-start">
        <div>
          <h2 class="text-xl font-semibold dark:text-white">
            Senha já definida
          </h2>
          <p class="text-sm text-gray-600 dark:text-gray-300 mt-1">
            Sua conta já possui uma senha configurada.
          </p>
        </div>

        <BaseButton class="w-full mt-auto" variant="outline" disabled>
          Alterar senha
        </BaseButton>
      </div>
    </div>
  </CardContainer>
</template>
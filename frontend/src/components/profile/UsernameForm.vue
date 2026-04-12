<script setup lang="ts">
import { useForm } from 'vee-validate';
import { useApi } from '../../composables/api/useApi';
import { useToast } from '../../composables/useToast';
import InputField from '../ui/form/InputField.vue';
import BaseButton from '../ui/BaseButton.vue';
import CardContainer from '../ui/card/CardContainer.vue';
import { setUserProfileSchema, type SetUserProfileForm } from '../../validation/schemas/user-profile.schema';
import { useAuthStore } from '../../stores/auth';
import type { User } from '../../interfaces/user.interfaces';

const authStore = useAuthStore();

const { request, loading } = useApi();
const { show } = useToast();

const { handleSubmit } = useForm<SetUserProfileForm>({
  validationSchema: setUserProfileSchema,
  initialValues: {
    name: authStore.user?.name
  }
});

const submit = handleSubmit(async (form) => {
  const { error, data } = await request<User>('post', '/user/update', form);

  if (error) {
    show({ message: error, type: 'error' });
    return;
  }

  show('Dados de perfil atualizados com sucesso!');
  authStore.setUser(data!);
});
</script>

<template>
  <CardContainer>
    <form @submit.prevent="submit" class="flex flex-col gap-4 h-full">
      <div>
        <h2 class="text-xl font-semibold text-gray-800">Atualizar perfil</h2>
        <p class="text-sm text-gray-500 mt-1">
          Atualize seus dados de cadastro através do formulário abaixo.
        </p>
      </div>

      <InputField name="name" label="Nome" />

      <BaseButton type="submit" class="w-full mt-auto" :disabled="loading">
        <span v-if="!loading">Atualizar dados cadastrais</span>
        <span v-else>Atualizando...</span>
      </BaseButton>
    </form>
  </CardContainer>
</template>

<script setup lang="ts">
import AppTitle from '../../components/layout/AppTitle.vue';
import UserConfig from '../../components/profile/UserConfig.vue';
import UserBaseData from '../../components/profile/UserBaseData.vue';
import UserProfileHeader from '../../components/profile/UserProfileHeader.vue';
import UserPassword from '../../components/profile/UserPassword.vue';
import { useAuthStore } from '../../stores/auth';
import { storeToRefs } from 'pinia';
import UsernameForm from '../../components/profile/UsernameForm.vue';

const { user } = storeToRefs(useAuthStore());
</script>

<template>
  <AppTitle title="Perfil do Usuário"
    subtitle="Configure suas informações públicas e defina os dados base que serão usados para gerar currículos e propostas personalizadas com IA." />

  <UserProfileHeader />

  <div class="grid md:grid-cols-2 gap-4">
    <UsernameForm class="h-full flex flex-col" />
    <UserPassword v-if="user?.onlyProvider" class="h-full flex flex-col" />
  </div>

  <UserBaseData />
  <UserConfig />
</template>

<script setup lang="ts">
import AppTitle from '../../components/layout/AppTitle.vue'
import UserConfig from '../../components/profile/UserConfig.vue'
import UserBaseData from '../../components/profile/UserBaseData.vue'
import UserProfileHeader from '../../components/profile/UserProfileHeader.vue';
import UserPassword from '../../components/profile/UserPassword.vue';
import { useAuthStore } from '../../stores/auth';
import { storeToRefs } from 'pinia';

const { user } = storeToRefs(useAuthStore())
</script>

<template>
    <AppTitle title="Perfil do Usuário"
        subtitle="Configure suas informações públicas e defina os dados base que serão usados para gerar currículos e propostas personalizadas com IA." />

    <UserProfileHeader />

    <UserPassword v-if="user?.onlyProvider" />
    <UserBaseData />
    <UserConfig />
</template>
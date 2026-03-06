<script setup lang="ts">
import { useRouter, type RouteLocationNamedRaw } from 'vue-router';

import AppContainer from './AppContainer.vue';
import BaseButton from '../ui/BaseButton.vue';
import BaseDropdown from '../ui/BaseDropdown.vue';
import RotateArrow from '../icon/RotateArrow.vue';
import UserAvatar from '../ui/UserAvatar.vue';
import { useAuthStore } from '../../stores/auth';

const router = useRouter();
const authStore = useAuthStore();

function handleLogout(close: () => void) {
  authStore.logout();
  close();
  router.push({ name: 'Login' });
}

interface MenuItem {
  label: string;
  to: RouteLocationNamedRaw;
}

interface Menu {
  label: string;
  items: MenuItem[];
}

const menus: Menu[] = [
  {
    label: 'Currículos',
    items: [
      { label: 'Criar Currículo', to: { name: 'ResumeGenerate' } },
      { label: 'Histórico', to: { name: 'ResumeHistory' } },
    ],
  },
  {
    label: 'Freelance',
    items: [
      { label: 'Criar Proposta', to: { name: 'FreelanceProposalGenerate' } },
      { label: 'Histórico', to: { name: 'FreelanceProposalHistory' } },
    ],
  },
  {
    label: 'Relatório',
    items: [
      { label: 'Tela de processamento', to: { name: 'HomeReport' } },
      { label: 'Solicitar relatório', to: { name: 'ReportSolicitation' } },
    ],
  },
];
</script>

<template>
  <header class="bg-white/80 backdrop-blur-md border-b sticky top-0 z-50 h-[68px]">
    <AppContainer class="py-2 h-full">
      <nav class="flex items-center justify-between text-sm font-medium h-[inherit]">
        <div class="flex items-center gap-8">
          <router-link :to="{ name: 'Home' }" class="text-gray-600 hover:text-black transition"> Início </router-link>

          <div v-if="authStore.user?.id" class="flex items-center gap-8">
            <BaseDropdown v-for="menu in menus" :key="menu.label">
              <template #trigger="{ toggle, isOpen }">
                <button @click="toggle" class="flex items-center gap-1 text-gray-600 hover:text-black transition"
                  aria-haspopup="true" :aria-expanded="isOpen">
                  {{ menu.label }}
                  <RotateArrow :rotate="isOpen" />
                </button>
              </template>

              <template #default="{ close }">
                <router-link v-for="item in menu.items" :key="item.label" :to="item.to" @click="close"
                  class="dropdown-item">
                  {{ item.label }}
                </router-link>
              </template>
            </BaseDropdown>
          </div>
        </div>

        <div class="flex items-center gap-4">
          <BaseButton v-if="!authStore.user?.id" as="router-link" :to="{ name: 'Login' }"> Entrar </BaseButton>

          <BaseDropdown v-else>
            <template #trigger="{ toggle, isOpen }">
              <button @click="toggle" class="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-100 transition"
                aria-haspopup="true" :aria-expanded="isOpen">
                <UserAvatar :user="authStore.user" size="sm" />

                <div class="text-left hidden sm:block">
                  <p class="text-sm font-medium leading-none">
                    {{ authStore.user.name }}
                  </p>
                  <p class="text-xs text-gray-500 leading-none mt-0.5">Minha conta</p>
                </div>

                <RotateArrow :rotate="isOpen" />
              </button>
            </template>

            <template #default="{ close }">
              <router-link :to="{ name: 'Profile' }" @click="close" class="dropdown-item"> Meu Perfil </router-link>

              <button @click="handleLogout(close)"
                class="w-full text-left px-4 py-2 text-red-500 hover:bg-red-50 transition">
                Sair da conta
              </button>
            </template>
          </BaseDropdown>
        </div>
      </nav>
    </AppContainer>
  </header>
</template>

<style scoped lang="postcss">
.dropdown-item {
  @apply block px-4 py-2 text-gray-600 hover:bg-gray-100 hover:text-black transition;
}
</style>

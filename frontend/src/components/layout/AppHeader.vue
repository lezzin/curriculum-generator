<script setup lang="ts">
import { useRouter, type RouteLocationNamedRaw } from 'vue-router';

import AppContainer from './AppContainer.vue';
import BaseButton from '../ui/BaseButton.vue';
import BaseDropdown from '../ui/BaseDropdown.vue';
import RotateArrow from '../icon/RotateArrow.vue';
import UserAvatar from '../ui/UserAvatar.vue';
import { useAuthStore } from '../../stores/auth';
import { ref, watch } from 'vue';
import ListIcon from '../icon/ListIcon.vue';
import { useMobile } from '../../composables/useMobile';
import { useTheme } from '../../composables/useTheme';
import SunIcon from '../icon/SunIcon.vue';
import MoonIcon from '../icon/MoonIcon.vue';

const router = useRouter();
const authStore = useAuthStore();
const { isMobile } = useMobile();
const { isDark, toggleTheme } = useTheme();

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

const isMenuOpen = ref(false);

watch(
  () => router.currentRoute.value.fullPath,
  () => {
    isMenuOpen.value = false;
  }
);

const isMenuActive = (menu: Menu) => {
  return menu.items.some((item) => {
    const routeName = (item.to as any).name;
    return router.currentRoute.value.name === routeName;
  });
};
</script>

<template>
  <BaseButton class="fixed top-2 left-2 z-50" @click="isMenuOpen = !isMenuOpen" size="icon" v-if="isMobile">
    <ListIcon />
  </BaseButton>

  <!-- Overlay para mobile -->
  <Transition name="fade">
    <div v-if="isMobile && isMenuOpen" class="fixed inset-0 bg-black/40 backdrop-blur-sm z-30" @click="isMenuOpen = false" />
  </Transition>

  <Transition name="slide">
    <header v-show="!isMobile || isMenuOpen"
      class="fixed bg-app-surface backdrop-blur-md border-b border-app-border top-0 z-40 h-screen w-2/3 md:w-full md:h-[68px]">
      <AppContainer class="py-2 h-full">
        <nav
          class="flex flex-col md:flex-row py-16 md:py-0 gap-8 md:gap-0 items-center justify-between text-sm font-medium md:h-[inherit]">
          <div class="flex items-center flex-col md:flex-row gap-8">
            <router-link :to="{ name: 'Home' }" class="nav-link" exact-active-class="nav-link-active"> Início
            </router-link>

            <div v-if="authStore.user?.id" class="flex flex-col md:flex-row items-center gap-8">
              <BaseDropdown v-for="menu in menus" :key="menu.label">
                <template #trigger="{ toggle, isOpen }">
                  <button @click="toggle" class="flex items-center gap-1 nav-link"
                    :class="{ 'text-black font-semibold': isMenuActive(menu) }" aria-haspopup="true"
                    :aria-expanded="isOpen">
                    {{ menu.label }}
                    <RotateArrow :rotate="isOpen" />
                  </button>
                </template>

                <template #default="{ close }">
                  <router-link v-for="item in menu.items" :key="item.label" :to="item.to" @click="close"
                    class="dropdown-item" exact-active-class="dropdown-item-active">
                    {{ item.label }}
                  </router-link>
                </template>
              </BaseDropdown>
            </div>
          </div>

          <div class="flex items-center gap-4">
            <BaseButton variant="ghost" size="icon" @click="toggleTheme"
              class="text-app-text-muted hover:bg-app-surface-muted"
              :title="isDark ? 'Ativar modo claro' : 'Ativar modo escuro'">
              <SunIcon v-if="isDark" />
              <MoonIcon v-else />
            </BaseButton>

            <BaseButton v-if="!authStore.user?.id" as="router-link" :to="{ name: 'Login' }"> Entrar </BaseButton>

            <BaseDropdown v-else>
              <template #trigger="{ toggle, isOpen }">
                <button @click="toggle"
                  class="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-app-surface-muted transition"
                  aria-haspopup="true" :aria-expanded="isOpen">
                  <UserAvatar :user="authStore.user" size="sm" />

                  <div class="text-left hidden sm:block">
                    <p class="text-sm font-medium leading-none text-app-text mb-1">
                      {{ authStore.user.name }}
                    </p>
                    <p class="text-xs text-app-text-muted leading-none">Minha conta</p>
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
  </Transition>
</template>

<style scoped lang="postcss">
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease-in-out;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(-100%);
}

@media (min-width: 768px) {
  .slide-enter-active,
  .slide-leave-active {
    transition: none;
  }
}

.nav-link {
  @apply text-app-text-muted hover:text-app-text transition-colors duration-200;
}

.nav-link-active {
  @apply text-app-text font-semibold;
}

.dropdown-item {
  @apply block px-4 py-2 text-app-text-muted hover:bg-app-surface-muted hover:text-app-text transition-colors duration-200;
}

.dropdown-item-active {
  @apply bg-app-surface-muted text-app-text font-medium border-l-4 border-app-text;
}
</style>

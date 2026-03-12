<script setup lang="ts">
import { useAuthStore } from '../../stores/auth';
import UserAvatar from '../ui/UserAvatar.vue';
const authStore = useAuthStore();
</script>

<template>
  <header class="flex items-center gap-4 mb-8 p-4 bg-gray-50 dark:bg-zinc-900 rounded-lg border dark:border-zinc-800">
    <UserAvatar v-if="authStore.user?.id" :user="authStore.user" />

    <div class="flex flex-col">
      <p class="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
        {{ authStore.user?.name }}
      </p>

      <p class="text-sm text-gray-600 dark:text-zinc-400">
        {{ authStore.user?.email }}
      </p>

      <p class="text-xs text-gray-500 dark:text-zinc-500 mt-1">Essas informações estão vinculadas à sua conta.</p>
    </div>
  </header>
</template>

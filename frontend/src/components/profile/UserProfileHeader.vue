<script setup lang="ts">
import { useAuthStore } from '../../stores/auth';
import UserAvatar from '../ui/UserAvatar.vue';
const authStore = useAuthStore();
</script>

<template>
  <header class="flex items-center gap-4 mb-8 p-4 bg-gray-50 rounded-lg">
    <UserAvatar v-if="authStore.user?.id" :user="authStore.user" />

    <div class="flex flex-col">
      <p class="text-lg font-semibold">
        {{ authStore.user?.name }}
      </p>

      <p class="text-sm text-gray-600">
        {{ authStore.user?.email }}
      </p>

      <p class="text-xs text-gray-500 mt-1">Essas informações estão vinculadas à sua conta.</p>
    </div>
  </header>
</template>

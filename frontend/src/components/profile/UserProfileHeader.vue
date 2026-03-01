<script setup lang="ts">
import { useAuth } from '../../composables/useAuth'
import UserAvatar from '../ui/UserAvatar.vue'
const { user } = useAuth()
</script>

<template>
    <header class="flex items-center gap-4 mb-8 p-4 bg-gray-50 rounded-lg">
        <UserAvatar v-if="user?.id" :user="user" />

        <div class="flex flex-col">
            <p class="text-lg font-semibold">
                {{ user?.name }}
            </p>

            <p class="text-sm text-gray-600">
                {{ user?.email }}
            </p>

            <p class="text-xs text-gray-500 mt-1">
                Essas informações estão vinculadas à sua conta.
            </p>
        </div>
    </header>
</template>
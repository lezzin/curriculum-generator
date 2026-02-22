<script setup lang="ts">
import AppContainer from './AppContainer.vue'
</script>

<template>
    <header class="bg-white/80 backdrop-blur-md border-b sticky top-0 z-50">
        <AppContainer class="px-8 py-4 flex items-center justify-between">
            <router-link to="/" class="text-xl font-bold tracking-tight hover:opacity-80 transition">
                AI Resume
            </router-link>

            <nav class="flex items-center gap-4 text-sm font-medium">
                <router-link to="/" class="text-gray-600 hover:text-black transition">
                    Início
                </router-link>

                <router-link to="/curriculum" class="text-gray-600 hover:text-black transition">
                    Currículo
                </router-link>

                <router-link to="/frelance" class="text-gray-600 hover:text-black transition">
                    Freelance
                </router-link>
            </nav>
        </AppContainer>
    </header>
</template>
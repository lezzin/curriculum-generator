<script setup lang="ts">
import { ref } from "vue"
import AppContainer from "./AppContainer.vue"

const isOpen = ref(false)

function toggle() {
    isOpen.value = !isOpen.value
}

function close() {
    isOpen.value = false
}
</script>

<template>
    <header class="bg-white/80 backdrop-blur-md border-b sticky top-0 z-50">
        <AppContainer class="px-8 py-4 flex items-center justify-between">
            <router-link to="/" class="text-xl font-bold tracking-tight hover:opacity-80 transition">
                AI Resume
            </router-link>

            <nav class="flex items-center gap-6 text-sm font-medium">
                <router-link to="/" class="text-gray-600 hover:text-black transition">
                    Início
                </router-link>

                <div class="relative">
                    <button @click="toggle" class="flex items-center gap-1 text-gray-600 hover:text-black transition">
                        Currículos
                        <svg class="w-4 h-4 transition-transform" :class="{ 'rotate-180': isOpen }" fill="none"
                            stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>

                    <transition name="fade">
                        <div v-if="isOpen"
                            class="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border py-2 z-50">
                            <router-link to="/resume" @click="close"
                                class="block px-4 py-2 text-gray-600 hover:bg-gray-100 hover:text-black transition">
                                Criar Currículo
                            </router-link>

                            <router-link to="/resume/history" @click="close"
                                class="block px-4 py-2 text-gray-600 hover:bg-gray-100 hover:text-black transition">
                                Histórico
                            </router-link>
                        </div>
                    </transition>
                </div>

                <router-link to="/frelance" class="text-gray-600 hover:text-black transition">
                    Freelance
                </router-link>
            </nav>
        </AppContainer>
    </header>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: all 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
    transform: translateY(-5px);
}
</style>
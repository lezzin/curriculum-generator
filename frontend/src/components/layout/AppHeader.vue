<script setup lang="ts">
import { ref } from "vue"
import AppContainer from "./AppContainer.vue"
import { useAuth } from "../../composables/useAuth"
import BaseButton from "../ui/BaseButton.vue"
import { useRouter } from "vue-router"

const router = useRouter()
const { isAuthenticated, clearToken } = useAuth()

const activeDropdown = ref<string | null>(null)

function toggle(menu: string) {
    activeDropdown.value =
        activeDropdown.value === menu ? null : menu
}

function close() {
    activeDropdown.value = null
}

function logout() {
    clearToken()
    router.push("/auth/login")
}
</script>

<template>
    <header class="bg-white/80 backdrop-blur-md border-b sticky top-0 z-50">
        <AppContainer class="px-8 py-4">
            <nav class="flex items-center justify-between gap-6 text-sm font-medium">
                <router-link to="/" class="text-gray-600 hover:text-black transition">
                    Início
                </router-link>

                <div v-if="isAuthenticated" class="flex items-center gap-6">
                    <div class="relative">
                        <button @click="toggle('resume')"
                            class="flex items-center gap-1 text-gray-600 hover:text-black transition">
                            Currículos
                            <svg class="w-4 h-4 transition-transform"
                                :class="{ 'rotate-180': activeDropdown === 'resume' }" fill="none" stroke="currentColor"
                                viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        <transition name="fade">
                            <div v-if="activeDropdown === 'resume'"
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

                    <div class="relative">
                        <button @click="toggle('freelance')"
                            class="flex items-center gap-1 text-gray-600 hover:text-black transition">
                            Freelance
                            <svg class="w-4 h-4 transition-transform"
                                :class="{ 'rotate-180': activeDropdown === 'freelance' }" fill="none"
                                stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        <transition name="fade">
                            <div v-if="activeDropdown === 'freelance'"
                                class="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border py-2 z-50">
                                <router-link to="/freelance" @click="close"
                                    class="block px-4 py-2 text-gray-600 hover:bg-gray-100 hover:text-black transition">
                                    Criar Proposta
                                </router-link>

                                <router-link to="/freelance/history" @click="close"
                                    class="block px-4 py-2 text-gray-600 hover:bg-gray-100 hover:text-black transition">
                                    Histórico
                                </router-link>
                            </div>
                        </transition>
                    </div>
                </div>

                <BaseButton v-if="!isAuthenticated" as="router-link" to="/auth/login" class="ml-auto">
                    Login
                </BaseButton>
                <BaseButton v-else @click="logout" class="ml-auto">
                    Logout
                </BaseButton>
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
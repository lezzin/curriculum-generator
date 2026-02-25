<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue"
import { useRoute, useRouter } from "vue-router"
import AppContainer from "./AppContainer.vue"
import BaseButton from "../ui/BaseButton.vue"
import { useAuth } from "../../composables/useAuth"

const router = useRouter()
const route = useRoute()
const { user, logout } = useAuth()

const activeDropdown = ref<string | null>(null)

function toggle(menu: string) {
    activeDropdown.value =
        activeDropdown.value === menu ? null : menu
}

function close() {
    activeDropdown.value = null
}

function handleLogout() {
    logout()
    close()
    router.push("/auth/login")
}

function handleClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement
    if (target.closest(".dropdown")) return
    close()
}

onMounted(() => {
    document.addEventListener("click", handleClickOutside)
})

onBeforeUnmount(() => {
    document.removeEventListener("click", handleClickOutside)
})
</script>

<template>
    <header class="bg-white/80 backdrop-blur-md border-b sticky top-0 z-50">
        <AppContainer class="px-8 py-4">
            <nav class="flex items-center justify-between text-sm font-medium">
                <div class="flex items-center gap-8">
                    <router-link to="/" class="text-gray-600 hover:text-black transition"
                        :class="{ 'text-black font-semibold': route.path === '/' }">
                        Início
                    </router-link>

                    <div v-if="user?.id" class="flex items-center gap-8">
                        <div class="relative dropdown">
                            <button @click.stop="toggle('resume')"
                                class="flex items-center gap-1 text-gray-600 hover:text-black transition"
                                :aria-expanded="activeDropdown === 'resume'">
                                Currículos
                                <svg class="w-4 h-4 transition-transform duration-200"
                                    :class="{ 'rotate-180': activeDropdown === 'resume' }" fill="none"
                                    stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            <transition name="dropdown">
                                <div v-if="activeDropdown === 'resume'"
                                    class="absolute left-0 mt-3 w-52 bg-white rounded-2xl shadow-xl border py-2">
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

                        <div class="relative dropdown">
                            <button @click.stop="toggle('freelance')"
                                class="flex items-center gap-1 text-gray-600 hover:text-black transition"
                                :aria-expanded="activeDropdown === 'freelance'">
                                Freelance
                                <svg class="w-4 h-4 transition-transform duration-200"
                                    :class="{ 'rotate-180': activeDropdown === 'freelance' }" fill="none"
                                    stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            <transition name="dropdown">
                                <div v-if="activeDropdown === 'freelance'"
                                    class="absolute left-0 mt-3 w-52 bg-white rounded-2xl shadow-xl border py-2">
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
                </div>

                <div class="flex items-center gap-4">
                    <BaseButton v-if="!user?.id" as="router-link" to="/auth/login">
                        Login
                    </BaseButton>

                    <template v-else>
                        <BaseButton as="router-link" to="/auth/profile">
                            Perfil
                        </BaseButton>

                        <BaseButton @click="handleLogout" variant="destructive">
                            Logout
                        </BaseButton>
                    </template>
                </div>
            </nav>
        </AppContainer>
    </header>
</template>

<style scoped>
.dropdown-enter-active,
.dropdown-leave-active {
    transition: all 0.18s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
    opacity: 0;
    transform: translateY(-6px) scale(0.98);
}
</style>
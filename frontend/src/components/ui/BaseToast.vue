<script setup lang="ts">
import { useToast } from '../../composables/useToast'

const { toasts, remove } = useToast()

function toastClasses(type: string) {
    switch (type) {
        case "success":
            return "bg-green-100 text-green-800 border-green-200"
        case "error":
            return "bg-red-100 text-red-800 border-red-200"
        case "warning":
            return "bg-yellow-100 text-yellow-800 border-yellow-200"
        case "info":
            return "bg-blue-100 text-blue-800 border-blue-200"
    }
}
</script>

<template>
    <div class="fixed top-5 right-5 z-50 flex flex-col gap-3">
        <transition-group name="toast" tag="div">
            <div v-for="toast in toasts" :key="toast.id" class="flex items-center w-80 p-4 rounded-xl shadow-lg border"
                :class="toastClasses(toast.type)">
                <div class="flex-1 text-sm">
                    {{ toast.message }}
                </div>

                <button @click="remove(toast.id)" class="ml-3 opacity-70 hover:opacity-100">
                    ✕
                </button>
            </div>
        </transition-group>
    </div>
</template>

<style scoped>
.toast-enter-active,
.toast-leave-active {
    transition: all 0.3s ease;
}

.toast-enter-from,
.toast-leave-to {
    opacity: 0;
    transform: translateY(-10px);
}
</style>
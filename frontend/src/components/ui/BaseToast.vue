<script setup lang="ts">
import { useRouter } from "vue-router"
import { useToast, type ToastType, type Toast } from "../../composables/useToast"
import BaseButton from "./BaseButton.vue"

const { toasts, remove } = useToast()
const router = useRouter()

const typeIcons: Record<ToastType, { svg: string; color: string }> = {
    success: {
        svg: `<svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20"><path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"/></svg>`,
        color: 'text-green-500 bg-green-100'
    },
    error: {
        svg: `<svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/></svg>`,
        color: 'text-red-500 bg-red-100'
    },
    warning: {
        svg: `<svg viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4"><path fill-rule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495ZM10 5a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 10 5Zm0 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clip-rule="evenodd" /></svg>`,
        color: 'text-yellow-500 bg-yellow-100'
    },
    info: {
        svg: `<svg viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4"><path fill-rule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495ZM10 5a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 10 5Zm0 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clip-rule="evenodd" /></svg>`,
        color: 'text-blue-500 bg-blue-100'
    },
}

function handleLink(toast: Toast) {
    if (!toast.link) {
        return
    }

    if (toast.link.external) {
        remove(toast.id)
        window.open(toast.link.to as string, "_blank")
        return
    }

    router.push({ name: toast.link.to })
    remove(toast.id)
}
</script>

<template>
    <div class="fixed bottom-5 right-5 z-50">
        <transition-group name="toast" tag="div" class="flex flex-col gap-2 items-end">
            <div class="flex items-center p-4 text-gray-500 bg-white rounded-lg border shadow-sm max-w-lg" role="alert"
                v-for="toast in toasts" :key="toast.id">
                <div class="inline-flex items-center justify-center shrink-0 w-8 h-8 rounded-lg"
                    :class="typeIcons[toast.type].color">
                    <span v-html="typeIcons[toast.type].svg"></span>
                    <span class="sr-only">Check icon</span>
                </div>

                <div class="ms-4 me-8">
                    <p class="text-sm font-normal">{{ toast.message }}</p>

                    <button v-if="toast.link" @click="handleLink(toast)"
                        class="text-sm font-medium text-blue-600 hover:underline">
                        {{ toast.link.label }}
                    </button>
                </div>

                <BaseButton type="button" aria-label="Close" @click="remove(toast.id)" variant="ghost" size="icon">
                    <span class="sr-only">Close</span>

                    <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
                        viewBox="0 0 14 14">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                    </svg>
                </BaseButton>
            </div>
        </transition-group>
    </div>
</template>

<style scoped>
.toast-enter-active,
.toast-leave-active {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.toast-enter-from {
    opacity: 0;
    transform: translateX(1rem) scale(0.96);
}

.toast-leave-to {
    opacity: 0;
    transform: translateX(1rem) scale(0.96);
    max-height: 0;
    margin: 0;
}

.toast-leave-active {
    overflow: hidden;
    max-height: 200px;
}
</style>
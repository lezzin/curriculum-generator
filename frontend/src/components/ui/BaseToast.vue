<script setup lang="ts">
import { useRouter } from "vue-router"
import { useToast, type ToastType, type Toast } from "../../composables/useToast"
import BaseButton from "./BaseButton.vue"
import SuccessIcon from "../icon/SuccessIcon.vue"
import ErrorIcon from "../icon/ErrorIcon.vue"
import WarningIcon from "../icon/WarningIcon.vue"
import InfoIcon from "../icon/InfoIcon.vue"
import type { Component } from "vue"
import CloseIcon from "../icon/CloseIcon.vue"

const { toasts, remove } = useToast()
const router = useRouter()

const typeIcons: Record<ToastType, { svg: Component; color: string }> = {
    success: {
        svg: SuccessIcon,
        color: 'text-green-500 bg-green-100'
    },
    error: {
        svg: ErrorIcon,
        color: 'text-red-500 bg-red-100'
    },
    warning: {
        svg: WarningIcon,
        color: 'text-yellow-500 bg-yellow-100'
    },
    info: {
        svg: InfoIcon,
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
                    <component :is="typeIcons[toast.type].svg" class="w-5 h-5" />
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
                    <CloseIcon />
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
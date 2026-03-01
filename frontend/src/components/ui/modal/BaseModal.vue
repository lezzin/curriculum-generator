<script setup lang="ts">
import { onMounted, onBeforeUnmount } from 'vue'
import CloseIcon from '../../icon/CloseIcon.vue'

interface Props {
    isOpen: boolean
    title?: string
    size?: 'sm' | 'md' | 'lg' | 'xl'
    persistent?: boolean
}

interface Emits {
    (e: 'update:isOpen', value: boolean): void
    (e: 'close'): void
}

const props = withDefaults(defineProps<Props>(), {
    size: 'md',
    persistent: false,
})

const emit = defineEmits<Emits>()

const close = () => {
    if (props.persistent) return
    emit('update:isOpen', false)
    emit('close')
}

const handleEsc = (e: KeyboardEvent) => {
    if (e.key === 'Escape') close()
}

onMounted(() => {
    window.addEventListener('keydown', handleEsc)
})

onBeforeUnmount(() => {
    window.removeEventListener('keydown', handleEsc)
})

const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
}
</script>

<template>
    <Teleport to="body">
        <Transition name="fade">
            <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center">
                <div class="absolute inset-0 bg-black/40" @click="close" />

                <Transition name="scale">
                    <div class="relative bg-white rounded-2xl shadow-2xl w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col"
                        :class="sizeClasses[size]">
                        <div v-if="title" class="flex items-center justify-between px-6 py-4 border-b">
                            <h2 class="text-lg font-semibold">
                                {{ title }}
                            </h2>

                            <button class="text-gray-500 hover:text-gray-800 transition" @click="close">
                                <CloseIcon />
                            </button>
                        </div>

                        <div class="p-6 overflow-y-auto">
                            <slot />
                        </div>

                        <div v-if="$slots.footer" class="px-6 py-4 border-t bg-gray-50">
                            <slot name="footer" />
                        </div>
                    </div>
                </Transition>
            </div>
        </Transition>
    </Teleport>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.scale-enter-active,
.scale-leave-active {
    transition: all 0.2s ease;
}

.scale-enter-from,
.scale-leave-to {
    opacity: 0;
    transform: scale(0.95);
}
</style>
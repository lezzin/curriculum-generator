<script setup lang="ts">
import { useAttrs } from 'vue'

defineProps<{
    label: string
    modelValue: string
    placeholder?: string
    disabled?: boolean
    error?: string
}>()

defineOptions({
    inheritAttrs: false
})

const attrs = useAttrs()

const emit = defineEmits<{
    (e: "update:modelValue", value: string): void
}>()

const handleInput = (event: Event) => {
    const target = event.target as HTMLInputElement
    emit("update:modelValue", target.value)
}
</script>

<template>
    <div class="flex flex-col gap-1">
        <label class="text-sm font-medium">
            {{ label }}
        </label>

        <input v-bind="attrs" :value="modelValue" @input="handleInput" :placeholder="placeholder" :disabled="disabled"
            :class="[
                'p-2 border rounded-lg focus:outline-none focus:ring-2 disabled:opacity-50',
                error ? 'border-red-500 focus:ring-red-500' : 'focus:ring-black'
            ]" />

        <p v-if="error" class="text-red-500 text-xs mt-1">
            {{ error }}
        </p>
    </div>
</template>
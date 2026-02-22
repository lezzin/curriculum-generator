<script setup lang="ts">
defineProps<{
    label: string
    modelValue: string
    placeholder?: string
    rows?: number
    disabled?: boolean
    error?: string
}>()

const emit = defineEmits<{
    (e: "update:modelValue", value: string): void
}>()

const handleInput = (event: Event) => {
    const target = event.target as HTMLTextAreaElement
    emit("update:modelValue", target.value)
}
</script>

<template>
    <div class="flex flex-col gap-1">
        <label class="text-sm font-medium">
            {{ label }}
        </label>

        <textarea :value="modelValue" @input="handleInput" :rows="rows ?? 6" :placeholder="placeholder"
            :disabled="disabled" :class="[
                'w-full p-4 border rounded-xl resize-none focus:outline-none focus:ring-2 transition',
                error ? 'border-red-500 focus:ring-red-500' : 'focus:ring-black'
            ]">
        </textarea>

        <p v-if="error" class="text-red-500 text-xs">
            {{ error }}
        </p>
    </div>
</template>
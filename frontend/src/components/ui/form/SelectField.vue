<script setup lang="ts">
defineProps<{
    label: string
    modelValue: string
    disabled?: boolean
    error?: string
}>()

const emit = defineEmits<{
    (e: "update:modelValue", value: string): void
}>()

const handleChange = (event: Event) => {
    const target = event.target as HTMLSelectElement
    emit("update:modelValue", target.value)
}
</script>

<template>
    <div class="flex flex-col gap-1">
        <label class="text-sm font-medium">
            {{ label }}
        </label>

        <select :value="modelValue" @change="handleChange" :disabled="disabled" :class="[
            'p-2 border rounded-lg focus:outline-none focus:ring-2 disabled:opacity-50',
            error
                ? 'border-red-500 focus:ring-red-500'
                : 'focus:ring-black'
        ]">
            <slot></slot>
        </select>

        <p v-if="error" class="text-red-500 text-xs">
            {{ error }}
        </p>
    </div>
</template>
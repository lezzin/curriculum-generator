<script setup lang="ts">
import { useField } from 'vee-validate'
import { DESCRIPTION_LENGTH } from '../../../constants/app.constants'

const props = withDefaults(
    defineProps<{
        label: string
        name: string
        placeholder?: string
        rows?: number
        disabled?: boolean
        showLength?: boolean
    }>(),
    {
        showLength: true
    }
)

const { value, errorMessage, handleBlur } = useField<string>(props.name)
</script>

<template>
    <div class="form-control">
        <label>
            {{ label }}
        </label>

        <textarea v-model="value" :rows="rows ?? 6" :placeholder="placeholder" :disabled="disabled" @blur="handleBlur"
            :class="errorMessage && 'error-field'"></textarea>

        <div class="flex items-center justify-between mt-1">
            <p v-if="errorMessage" class="error-text">
                {{ errorMessage }}
            </p>

            <small v-if="showLength" class="text-gray-700 ms-auto">
                {{ value?.length ?? 0 }}/{{ DESCRIPTION_LENGTH.max }}
            </small>
        </div>
    </div>
</template>
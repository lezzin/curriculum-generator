<script setup lang="ts">
import { useField } from 'vee-validate';

const props = defineProps<{
    label: string
    name: string
    disabled?: boolean
}>()

const { value, errorMessage, handleBlur } = useField(props.name)
</script>

<template>
    <div class="form-control">
        <label>
            {{ label }}
        </label>

        <select :id="name" :name="name" v-model="value" :disabled="disabled" @blur="handleBlur"
            :class="errorMessage && 'error-field'">
            <option value="" disabled>Selecione uma opção</option>
            <slot></slot>
        </select>

        <p v-if="errorMessage" class="error-text">
            {{ errorMessage }}
        </p>
    </div>
</template>
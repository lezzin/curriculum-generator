<script setup lang="ts">
import { useField } from 'vee-validate';
import { computed, useSlots } from 'vue';

interface Props {
    label: string
    name: string
    disabled?: boolean
}

const props = defineProps<Props>()
const hasButtonHelper = computed(() => !!useSlots()['button-helper']);

const { value, errorMessage, handleBlur } = useField<string>(props.name)
</script>

<template>
    <div class="form-control">
        <label>
            {{ label }}
        </label>

        <div class="flex items-center">
            <select :id="name" :name="name" v-model="value" :disabled="disabled" @blur="handleBlur"
                :class="[errorMessage && 'error-field', hasButtonHelper && 'has-button-helper']">
                <option value="" disabled>Selecione uma opção</option>
                <slot></slot>
            </select>

            <template v-if="$slots['button-helper']">
                <slot name="button-helper"></slot>
            </template>
        </div>

        <p v-if="errorMessage" class="error-text">
            {{ errorMessage }}
        </p>
    </div>
</template>
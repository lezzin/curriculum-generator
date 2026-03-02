<script setup lang="ts">
import { useField } from 'vee-validate';
import { computed, ref, useSlots } from 'vue';
import RotateArrow from '../../icon/RotateArrow.vue';

interface Props {
    label: string
    name: string
    disabled?: boolean
}

const props = defineProps<Props>()
const hasButtonHelper = computed(() => !!useSlots()['button-helper']);
const shouldRotate = ref(false)

const { value, errorMessage, handleBlur } = useField<string>(props.name)

function handleFocus() {
    shouldRotate.value = true
}

function handleSelectBlur(e: Event) {
    shouldRotate.value = false
    handleBlur(e)
}
</script>

<template>
    <div class="form-control">
        <label>
            {{ label }}
        </label>

        <div class="flex items-center">
            <div class="relative w-full">
                <select :id="name" :name="name" v-model="value" :disabled="disabled" @focus="handleFocus"
                    @blur="handleSelectBlur"
                    :class="[errorMessage && 'error-field', hasButtonHelper && 'has-button-helper']">
                    <option value="" disabled>Selecione uma opção</option>
                    <slot></slot>
                </select>

                <RotateArrow :rotate="shouldRotate" class="absolute right-2 top-3 pointer-events-none" />
            </div>

            <template v-if="$slots['button-helper']">
                <slot name="button-helper"></slot>
            </template>
        </div>

        <p v-if="errorMessage" class="error-text">
            {{ errorMessage }}
        </p>
    </div>
</template>
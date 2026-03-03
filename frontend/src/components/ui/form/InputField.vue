<script setup lang="ts">
import { useField } from 'vee-validate';
import { computed } from 'vue';

interface Props {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  disabled?: boolean;
  helper?: string;
}

const props = defineProps<Props>();

const { value, errorMessage, handleBlur } = useField<string>(props.name);

const inputType = computed(() => props.type ?? 'text');
</script>

<template>
  <div class="form-control">
    <label :for="name">
      {{ label }}
    </label>

    <input
      :id="name"
      :name="name"
      :type="inputType"
      v-model="value"
      :placeholder="placeholder"
      :disabled="disabled"
      @blur="handleBlur"
      :class="errorMessage && 'error-field'"
    />

    <p v-if="helper" class="text-xs text-gray-500 mt-1">
      {{ helper }}
    </p>

    <p v-if="errorMessage" class="error-text">
      {{ errorMessage }}
    </p>
  </div>
</template>

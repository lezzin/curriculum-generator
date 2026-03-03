<script setup lang="ts">
import { useField } from 'vee-validate';

interface Props {
  label: string;
  name: string;
  placeholder?: string;
  rows?: number;
  disabled?: boolean;
  showLength?: boolean;
  maxLength?: number;
}

const props = withDefaults(defineProps<Props>(), {
  showLength: false,
});

const { value, errorMessage, handleBlur } = useField<string>(props.name);
</script>

<template>
  <div class="form-control">
    <label>
      {{ label }}
    </label>

    <textarea
      v-model="value"
      :rows="rows ?? 6"
      :placeholder="placeholder"
      :disabled="disabled"
      @blur="handleBlur"
      :class="errorMessage && 'error-field'"
    ></textarea>

    <div class="flex items-center justify-between mt-1">
      <p v-if="errorMessage" class="error-text">
        {{ errorMessage }}
      </p>

      <small v-if="showLength" class="text-gray-700 ms-auto"> {{ value?.length ?? 0 }}/{{ maxLength }} </small>
    </div>
  </div>
</template>

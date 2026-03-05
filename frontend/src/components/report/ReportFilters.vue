<script setup lang="ts">
import BaseButton from '../ui/BaseButton.vue'
import InputField from '../ui/form/InputField.vue'
import SelectField from '../ui/form/SelectField.vue'

defineProps<{
    loading: boolean
}>()

defineEmits(['submit'])
</script>

<template>
    <form class="space-y-4" @submit.prevent="$emit('submit')">
        <div class="grid md:grid-cols-3 gap-2">
            <InputField type="date" label="Data inicial" name="initial_date_creation" />
            <InputField type="date" label="Data final" name="final_date_creation" />

            <div class="grid md:grid-cols-2 gap-2">
                <SelectField label="Limite" name="limit">
                    <option value="10">10</option>
                    <option value="20">20</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                </SelectField>

                <div>
                    <p>&nbsp;</p>
                    <BaseButton type="submit" :disabled="loading" :loading="loading" class="w-full">
                        Buscar
                    </BaseButton>
                </div>
            </div>
        </div>
    </form>
</template>
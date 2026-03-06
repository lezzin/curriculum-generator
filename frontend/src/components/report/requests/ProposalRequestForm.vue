<script setup lang="ts">
import { useForm } from 'vee-validate'
import { useReportRequest } from '../../../composables/useReportRequest';
import BaseReportForm from './BaseReportForm.vue';
import { proposalReportSchema } from '../../../validation/schemas/proposal-report.schema';
import InputField from '../../ui/form/InputField.vue';
import BaseButton from '../../ui/BaseButton.vue';

const emit = defineEmits(['saved',])

const { submit, loading } = useReportRequest('/proposal-generation')

const { handleSubmit } = useForm({
    validationSchema: proposalReportSchema
})

const requestReport = handleSubmit(async (form) => {
    const success = await submit(form)
    if (!success) return;
    emit('saved')
})
</script>

<template>
    <BaseReportForm title="Propostas" description="Solicite um novo relatório de propostas">
        <form class="space-y-4" @submit.prevent="requestReport">
            <div class="grid md:grid-cols-3 gap-2">
                <InputField type="date" label="Data inicial" name="initial_date_creation" />
                <InputField type="date" label="Data final" name="final_date_creation" />

                <div>
                    <p>&nbsp;</p>

                    <BaseButton type="submit" :loading="loading" class="w-full">
                        Solicitar
                    </BaseButton>
                </div>
            </div>
        </form>
    </BaseReportForm>
</template>
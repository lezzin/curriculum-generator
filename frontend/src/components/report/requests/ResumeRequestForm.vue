<script setup lang="ts">
import { useForm } from 'vee-validate'
import { useReportRequest } from '../../../composables/useReportRequest';
import { resumeReportSchema } from '../../../validation/schemas/resume-report.schema';
import InputField from '../../ui/form/InputField.vue';
import BaseReportForm from './BaseReportForm.vue';
import BaseButton from '../../ui/BaseButton.vue';

interface Props {
    isOpen: boolean
}

const props = defineProps<Props>()

const emit = defineEmits([
    'close',
    'saved',
    'update:isOpen'
])

const { submit, loading } = useReportRequest('/resume-generation')

const { handleSubmit } = useForm({
    validationSchema: resumeReportSchema
})

const requestReport = handleSubmit(async (form) => {
    const success = await submit(form)

    if (success) {
        emit('close')
        emit('saved')
    }
})
</script>

<template>
    <BaseReportForm :is-open="isOpen" title="Gerar relatório" description="Solicite um novo relatório de currículos"
        modal-title="Relatório de currículos gerados" @close="emit('close')"
        @update:isOpen="emit('update:isOpen', $event)">

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
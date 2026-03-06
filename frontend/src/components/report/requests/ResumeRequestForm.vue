<script setup lang="ts">
import { useReportApi } from '../../../composables/api/useReportApi'
import { useForm } from 'vee-validate'
import { useToast } from '../../../composables/useToast'

import BaseButton from '../../../components/ui/BaseButton.vue'
import InputField from '../../../components/ui/form/InputField.vue'
import AppTitle from '../../../components/layout/AppTitle.vue'
import { resumeReportSchema, type ResumeReportForm } from '../../../validation/schemas/resume-report.schema'
import BaseModal from '../../ui/modal/BaseModal.vue'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '../../../stores/auth'
import CardContainer from '../../ui/card/CardContainer.vue'

interface Props {
    isOpen: boolean;
}

interface Emit {
    (e: 'close'): void;
    (e: 'saved'): Promise<void>;
    (e: 'update:isOpen', value: boolean): Promise<void>;
}

const props = defineProps<Props>()
const emit = defineEmits<Emit>()

const { user } = storeToRefs(useAuthStore())
const { loading, request } = useReportApi()
const { show } = useToast()

const { handleSubmit } = useForm<ResumeReportForm>({
    validationSchema: resumeReportSchema,
})

const requestReport = handleSubmit(async (form) => {
    const { error } = await request('post', '/resume-generation', {
        user_uuid: user.value?.id,
        initial_date_creation: form.initial_date_creation,
        final_date_creation: form.final_date_creation
    })

    if (!error) {
        show("Relatório enviado para processamento com sucesso!")
        emit('close');
        emit('saved');
        return;
    }

    show({ message: error, type: 'error' })
})
</script>

<template>
    <CardContainer size="sm" class="bg-slate-50 flex items-center justify-between">
        <div>
            <p class="font-medium">Gerar relatório</p>
            <p class="text-sm text-gray-500">
                Solicite um novo relatório de currículos.
            </p>
        </div>

        <BaseButton @click="$emit('update:isOpen', true)">
            Gerar relatório
        </BaseButton>
    </CardContainer>

    <BaseModal :is-open="isOpen" @close="emit('close')">
        <div class="space-y-6">
            <AppTitle title="Relatório de currículos gerados" />

            <form class="space-y-4" @submit.prevent="requestReport">
                <div class="grid md:grid-cols-3 gap-2">
                    <InputField type="date" label="Data inicial" name="initial_date_creation" />
                    <InputField type="date" label="Data final" name="final_date_creation" />

                    <div>
                        <p>&nbsp;</p>
                        <BaseButton type="submit" :disabled="loading" :loading="loading" class="w-full">
                            Solicitar
                        </BaseButton>
                    </div>
                </div>
            </form>
        </div>
    </BaseModal>
</template>
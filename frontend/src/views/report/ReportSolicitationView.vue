<script setup lang="ts">
import { reactive } from 'vue'
import ResumeRequestForm from '../../components/report/requests/ResumeRequestForm.vue'
import ProposalRequestForm from '../../components/report/requests/ProposalRequestForm.vue'
import ConfirmModal from '../../components/ui/modal/ConfirmModal.vue'
import { useRouter } from 'vue-router'
import AppTitle from '../../components/layout/AppTitle.vue'

const router = useRouter();

type Form = 'resume' | 'proposal' | 'confirm_modal'

const modalStates = reactive<Record<Form, boolean>>({
    resume: false,
    proposal: false,
    confirm_modal: false,
})

const setModalState = (modal: Form, value: boolean) => {
    modalStates[modal] = value;
}

const goToReportScreen = () => {
    router.push({ name: 'HomeReport' })
}
</script>

<template>
    <div class="space-y-8">
        <AppTitle title="Solicitar geração de relatórios"
            subtitle="Envie solicitações de relatórios que serão gerados em segundo plano" />

        <ResumeRequestForm v-model:isOpen="modalStates.resume" @close="() => setModalState('resume', false)"
            @saved="() => setModalState('confirm_modal', true)" />

        <ProposalRequestForm v-model:isOpen="modalStates.proposal" @close="() => setModalState('proposal', false)"
            @saved="() => setModalState('confirm_modal', true)" />

        <ConfirmModal title="Redirecionamento"
            message="Relatório enviado para processamento com sucesso! Ir para a tela de processamento?"
            :is-open="modalStates.confirm_modal" @cancel="() => setModalState('confirm_modal', false)"
            @confirm="goToReportScreen" />
    </div>
</template>
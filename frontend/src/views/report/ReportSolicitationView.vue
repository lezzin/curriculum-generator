<script setup lang="ts">
import { reactive } from 'vue';
import ReportRequestForm from '../../components/report/requests/ReportRequestForm.vue';
import { reportRequestSchema } from '../../validation/schemas/report-request.schema';
import InputField from '../../components/ui/form/InputField.vue';
import ConfirmModal from '../../components/ui/modal/ConfirmModal.vue';
import BaseAccordion from '../../components/ui/BaseAccordion.vue';
import { useRouter } from 'vue-router';
import AppTitle from '../../components/layout/AppTitle.vue';
import { userRequestSchema } from '../../validation/schemas/user-request.schema';

const router = useRouter();

const modalStates = reactive({
  confirm_modal: false,
});

const setModalState = (value: boolean) => {
  modalStates.confirm_modal = value;
};

const goToReportScreen = () => {
  router.push({ name: 'HomeReport' });
};
</script>

<template>
  <div class="space-y-8">
    <AppTitle title="Solicitar geração de relatórios"
      subtitle="Envie solicitações de relatórios que serão gerados em segundo plano" />

    <div class="space-y-4">
      <BaseAccordion title="Relatório de Usuários" description="Visualize a quantidade de usuários na plataforma">
        <ReportRequestForm endpoint="/reports/user" :schema="userRequestSchema" @saved="() => setModalState(true)">
          <InputField type="date" label="Nome" name="name" />
          <InputField type="date" label="Email" name="email" />
          <InputField type="date" label="Data inicial" name="initial_date_creation" />
          <InputField type="date" label="Data final" name="final_date_creation" />
        </ReportRequestForm>
      </BaseAccordion>

      <BaseAccordion title="Relatório de Currículos"
        description="Gere um relatório detalhado de todos os currículos criados no período">
        <ReportRequestForm endpoint="/reports/resume" :schema="reportRequestSchema" @saved="() => setModalState(true)">
          <InputField type="date" label="Data inicial" name="initial_date_creation" />
          <InputField type="date" label="Data final" name="final_date_creation" />
        </ReportRequestForm>
      </BaseAccordion>

      <BaseAccordion title="Relatório de Propostas"
        description="Visualize o desempenho e as solicitações de propostas de freelance">
        <ReportRequestForm endpoint="/reports/proposal" :schema="reportRequestSchema"
          @saved="() => setModalState(true)">
          <InputField type="date" label="Data inicial" name="initial_date_creation" />
          <InputField type="date" label="Data final" name="final_date_creation" />
        </ReportRequestForm>
      </BaseAccordion>
    </div>

    <ConfirmModal title="Redirecionamento"
      message="Relatório enviado para processamento com sucesso!<br>Ir para a tela de processamento?"
      confirmVariant="default" cancelVariant="destructive" :is-open="modalStates.confirm_modal"
      @cancel="() => setModalState(false)" @confirm="goToReportScreen" />
  </div>
</template>

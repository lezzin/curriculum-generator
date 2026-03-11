<script setup lang="ts">
import { useReportApi } from '../../composables/api/useReportApi';
import { useToast } from '../../composables/useToast';
import { handleDownload } from '../../helper/string.helper';
import { PROCESS_STATUS, type ProcessStatus } from '../../types/report.types';

import BaseButton from '../ui/BaseButton.vue';
import CardContainer from '../ui/card/CardContainer.vue';
import ReportStatusBadge from './ReportStatusBadge.vue';

type StatusConfig = {
  cancel?: boolean;
  download?: boolean | 'expired';
};

const STATUS_CONFIG: Record<number, StatusConfig> = {
  [PROCESS_STATUS.WAITING]: { cancel: true },
  [PROCESS_STATUS.PROCESSING]: { cancel: true },
  [PROCESS_STATUS.SUCCEEDED]: { download: true },
  [PROCESS_STATUS.EXPIRED]: { download: 'expired' },
};

const props = defineProps<{
  items: any[];
  loading: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:items', items: any[]): void;
}>();

const { request, loading: loadingReportRequest } = useReportApi();
const { show } = useToast();

function getStatusConfig(statusId: ProcessStatus): StatusConfig {
  return STATUS_CONFIG[statusId] ?? {};
}

function getProgressColor(statusId: ProcessStatus, percent: number): string {
  if (statusId === PROCESS_STATUS.CANCELLED) return 'bg-gray-400';
  if (statusId === PROCESS_STATUS.SUCCEEDED) return 'bg-green-500';
  if (percent >= 75) return 'bg-blue-500';
  if (percent >= 40) return 'bg-blue-400';
  return 'bg-blue-300';
}

async function handleDownloadFile(path: string) {
  const { data, error } = await request<{ url: string }>('get', '/report/download-file', { path });

  if (error) {
    show({ message: error, type: 'error' });
    return;
  }

  if (!data?.url) {
    show({ message: 'URL não encontrada para o registro', type: 'warning' });
    return;
  }

  handleDownload(data.url);
}

async function handleChangeProcessStatus(processId: string, statusId: ProcessStatus) {
  const { data, error } = await request<any>('post', '/report/change-status', {
    process_id: processId,
    status_id: statusId,
  });

  if (error) {
    show({ message: error, type: 'error' });
    return;
  }

  const updatedItems = props.items.map((item) => (item.progress_id == data.progress_id ? data : item));

  emit('update:items', updatedItems);
  show('Status do processo atualizado com sucesso!');
}
</script>

<template>
  <CardContainer v-if="props.items.length" size="lg">
    <div class="overflow-x-auto border rounded-lg shadow-sm text-sm">
      <table class="table-fixed w-full border-collapse">
        <thead class="bg-gray-100 text-left text-gray-600 text-xs uppercase tracking-wide">
          <tr>
            <th class="px-3 py-3 w-52">Nome</th>
            <th class="px-3 py-3 w-52">Progresso</th>
            <th class="px-3 py-3 w-44">Iniciado</th>
            <th class="px-3 py-3 w-44">Finalizado</th>
            <th class="px-3 py-3 w-28">Status</th>
            <th class="px-3 py-3 w-36">Ações</th>
          </tr>
        </thead>

        <tbody class="divide-y divide-gray-100">
          <tr
            v-for="item in props.items"
            :key="item.id"
            class="hover:bg-blue-50/40 transition-colors duration-150 text-left"
          >
            <td class="px-3 py-3 max-w-0">
              <span class="block truncate font-medium text-gray-800" :title="item.report_name">
                {{ item.report_name }}
              </span>
            </td>

            <td class="px-3 py-3">
              <div class="flex flex-col gap-1">
                <div class="flex justify-between items-center text-xs text-gray-500">
                  <span> {{ item.processed_records ?? 0 }} / {{ item.total_records ?? '?' }} registros </span>

                  <span class="font-semibold text-gray-700"> {{ item.percentage }}% </span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div
                    class="h-2 rounded-full transition-all duration-500"
                    :class="[
                      getProgressColor(item.status_id, item.percentage),
                      item.status_id === PROCESS_STATUS.PROCESSING ? 'animate-pulse' : '',
                    ]"
                    :style="{ width: item.percentage + '%' }"
                  />
                </div>
              </div>
            </td>

            <td class="px-3 py-3 text-gray-600">{{ item.started_at ?? '-' }}</td>
            <td class="px-3 py-3 text-gray-600">{{ item.finished_at ?? '-' }}</td>

            <td class="px-3 py-3">
              <ReportStatusBadge :text="item.status_name" :status-id="item.status_id" />
            </td>

            <td class="px-3 py-3">
              <div class="flex gap-2">
                <BaseButton
                  v-if="getStatusConfig(item.status_id).download && item.final_file_path"
                  size="sm"
                  variant="outline"
                  :disabled="loadingReportRequest || getStatusConfig(item.status_id).download === 'expired'"
                  @click="handleDownloadFile(item.final_file_path)"
                >
                  Download
                </BaseButton>

                <BaseButton
                  v-if="getStatusConfig(item.status_id).cancel"
                  size="sm"
                  variant="destructive"
                  :disabled="loadingReportRequest"
                  @click="handleChangeProcessStatus(item.progress_id, PROCESS_STATUS.CANCELLED)"
                >
                  Cancelar
                </BaseButton>

                <span
                  v-if="
                    (!getStatusConfig(item.status_id).download && !getStatusConfig(item.status_id).cancel) ||
                    !item.final_file_path
                  "
                >
                  -
                </span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </CardContainer>

  <p v-else-if="!props.loading" class="text-center text-gray-500">Nenhum resultado para a busca.</p>
</template>

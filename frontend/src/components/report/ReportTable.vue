<script setup lang="ts">
import { useReportApi } from '../../composables/api/useReportApi'
import { useToast } from '../../composables/useToast'
import { handleDownload } from '../../helper/string.helper'
import { PROCESS_STATUS, type ProcessStatus } from '../../types/report.types'

import BaseButton from '../ui/BaseButton.vue'
import CardContainer from '../ui/card/CardContainer.vue'
import ReportStatusBadge from './ReportStatusBadge.vue'

type StatusConfig = {
    cancel?: boolean
    download?: boolean | 'expired'
}

const STATUS_CONFIG: Record<number, StatusConfig> = {
    [PROCESS_STATUS.WAITING]: { cancel: true },
    [PROCESS_STATUS.PROCESSING]: { cancel: true },
    [PROCESS_STATUS.SUCCEEDED]: { download: true },
    [PROCESS_STATUS.EXPIRED]: { download: 'expired' }
}

const props = defineProps<{
    items: any[]
    loading: boolean
}>()

const { request, loading: loadingReportRequest } = useReportApi()
const { show } = useToast()

function getStatusConfig(statusId: ProcessStatus): StatusConfig {
    return STATUS_CONFIG[statusId] ?? {}
}

async function handleDownloadFile(path: string) {
    const { data, error } = await request<{ url: string }>('get', '/report/download-file', { path })

    if (error) {
        show({ message: error, type: 'error' })
        return
    }

    if (!data?.url) {
        show({ message: 'URL não encontrada para o registro', type: 'warning' })
        return
    }

    handleDownload(data.url);
}

async function handleChangeProcessStatus(
    processId: string,
    statusId: ProcessStatus
) {
    const { data, error } = await request<{ message: string }>('post', '/report/change-status', {
        process_id: processId,
        status_id: statusId
    })

    if (error) {
        show({ message: error, type: 'error' })
        return
    }

    show(data?.message ?? 'Status do processo atualizado com sucesso!')
}
</script>

<template>
    <CardContainer v-if="props.items.length" size="lg">
        <div class="overflow-x-auto border rounded-lg shadow-sm text-sm">
            <table class="table-fixed w-full border-collapse">
                <thead class="bg-gray-100 text-left text-gray-700">
                    <tr>
                        <th class="p-2 w-56 truncate">Nome</th>
                        <th class="p-2 w-36">Registros</th>
                        <th class="p-2 w-36">Processados</th>
                        <th class="p-2 w-56">Iniciado</th>
                        <th class="p-2 w-56">Finalizado</th>
                        <th class="p-2 w-28">Status</th>
                        <th class="p-2 w-40">Ações</th>
                    </tr>
                </thead>

                <tbody class="divide-y divide-gray-200">
                    <tr v-for="item in props.items" :key="item.id" class="hover:bg-gray-50 text-left">
                        <td class="p-2 truncate">{{ item.report_name }}</td>
                        <td class="p-2">{{ item.total_records }}</td>
                        <td class="p-2">{{ item.processed_records }}%</td>

                        <td class="p-2">{{ item.started_at ?? '-' }}</td>
                        <td class="p-2">{{ item.finished_at ?? '-' }}</td>

                        <td class="p-2">
                            <ReportStatusBadge :text="item.status_name" :status-id="item.status_id" />
                        </td>

                        <td class="p-2 flex gap-2">
                            <BaseButton v-if="getStatusConfig(item.status_id).download && item.final_file_path"
                                size="sm" variant="outline" :disabled="loadingReportRequest"
                                @click="handleDownloadFile(item.final_file_path)">
                                Download
                            </BaseButton>

                            <BaseButton v-if="getStatusConfig(item.status_id).cancel" size="sm" variant="destructive"
                                :disabled="loadingReportRequest"
                                @click="handleChangeProcessStatus(item.progress_id, PROCESS_STATUS.CANCELLED)">
                                Cancelar
                            </BaseButton>

                            <span v-if="
                                !getStatusConfig(item.status_id).download &&
                                !getStatusConfig(item.status_id).cancel
                            ">
                                -
                            </span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </CardContainer>

    <p v-else-if="!props.loading" class="text-center text-gray-500">
        Nenhum resultado para a busca.
    </p>
</template>
<script setup lang="ts">
import { useReportApi } from '../../composables/api/useReportApi';
import { useToast } from '../../composables/useToast';
import BaseButton from '../ui/BaseButton.vue'
import CardContainer from '../ui/card/CardContainer.vue';
import ReportStatusBadge from './ReportStatusBadge.vue'

defineProps<{
    items: any[],
    loading: boolean
}>()

const { request, loading } = useReportApi()
const { show } = useToast();

const handleDownloadFile = async (path: string) => {
    const { data, error } = await request<{ url: string }>('get', '/report/download-file', { path });

    if (error) {
        show({ message: error, type: 'error' });
        return;
    }

    if (!data?.url) {
        show({ message: 'URL não encontrada para o registro', type: 'warning' });
        return;
    }

    const url = data?.url
    window.location.href = url;
}
</script>

<template>
    <CardContainer v-if="items.length" size="lg">
        <div class="overflow-x-auto border rounded-lg shadow-sm">
            <table class="table-fixed w-full border-collapse">
                <thead class="bg-gray-100 text-left text-gray-700">
                    <tr>
                        <th class="p-2 w-56 truncate" title="Nome do relatório">Nome</th>
                        <th class="p-2 w-36">Registros</th>
                        <th class="p-2 w-36">Processados</th>
                        <th class="p-2 w-56">Iniciado</th>
                        <th class="p-2 w-56">Finalizado</th>
                        <th class="p-2 w-28">Status</th>
                        <th class="p-2 w-40 truncate" title="Arquivo final do relatório">Arquivo</th>
                    </tr>
                </thead>

                <tbody class="divide-y divide-gray-200">
                    <tr v-for="item in items" :key="item.id" class="hover:bg-gray-50 text-left">
                        <td class="p-2 truncate" :title="item.report_name">{{ item.report_name }}</td>
                        <td class="p-2">{{ item.total_records }}</td>
                        <td class="p-2">{{ item.processed_records }}%</td>

                        <td class="p-2">{{ item.started_at ?? '-' }}</td>
                        <td class="p-2">{{ item.finished_at ?? '-' }}</td>

                        <td class="p-2">
                            <ReportStatusBadge :text="item.status_name" :status-id="item.status_id" />
                        </td>

                        <td class="p-2">
                            <BaseButton v-if="item.final_file_path" size="sm" variant="outline"
                                @click="handleDownloadFile(item.final_file_path)">
                                Download
                            </BaseButton>
                            <span v-else>-</span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </CardContainer>

    <p v-else-if="!loading" class="text-center text-gray-500">
        Nenhum resultado para a busca.
    </p>
</template>
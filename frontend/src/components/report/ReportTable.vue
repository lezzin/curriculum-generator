<script setup lang="ts">
import BaseButton from '../ui/BaseButton.vue'
import CardContainer from '../ui/card/CardContainer.vue';
import ReportStatusBadge from './ReportStatusBadge.vue'

defineProps<{
    items: any[]
}>()
</script>

<template>
    <CardContainer v-if="items.length" size="lg">
        <table class="w-full text-sm">
            <thead class="border-b">
                <tr class="text-left">
                    <th class="p-2">Nome</th>
                    <th class="p-2">Registros</th>
                    <th class="p-2">Processados</th>
                    <th class="p-2">Iniciado</th>
                    <th class="p-2">Finalizado</th>
                    <th class="p-2">Status</th>
                    <th class="p-2">Arquivo</th>
                </tr>
            </thead>

            <tbody>
                <tr v-for="item in items" :key="item.id" class="border-b">
                    <td class="p-2">{{ item.report_name }}</td>
                    <td class="p-2">{{ item.total_records }}</td>
                    <td class="p-2">{{ item.processed_records }}%</td>

                    <td class="p-2">{{ item.started_at ?? '-' }}</td>
                    <td class="p-2">{{ item.finished_at ?? '-' }}</td>

                    <td class="p-2">
                        <ReportStatusBadge :text="item.status_name" :status-id="item.status_id" />
                    </td>

                    <td class="p-2">
                        <BaseButton v-if="item.final_file_path" size="sm" as="a" variant="outline"
                            :href="`/storage/${item.final_file_path}`">
                            Download
                        </BaseButton>

                        <span v-else>-</span>
                    </td>
                </tr>
            </tbody>
        </table>
    </CardContainer>
    <p v-else class="text-center text-gray-500">Nenhum resultado para a busca.</p>
</template>
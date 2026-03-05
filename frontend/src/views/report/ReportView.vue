<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useApi } from '../../composables/useApi'
import { useForm } from 'vee-validate'
import { reportSchema, type ReportForm } from '../../validation/schemas/report.schema'
import { useToast } from '../../composables/useToast'

import BaseButton from '../../components/ui/BaseButton.vue'
import CardContainer from '../../components/ui/card/CardContainer.vue'
import InputField from '../../components/ui/form/InputField.vue'
import SelectField from '../../components/ui/form/SelectField.vue'
import AppTitle from '../../components/layout/AppTitle.vue'
import BaseBadge, { type Variant } from '../../components/ui/BaseBadge.vue'
import { getTodayDate } from '../../helper/string.helper'

const { loading, request } = useApi()
const { show } = useToast()

const page = ref(1)

const reportData = reactive({
    items: [] as any[],
    meta: null as any
})

const { handleSubmit, values } = useForm<ReportForm>({
    validationSchema: reportSchema,
    initialValues: {
        initial_date_creation: getTodayDate(),
        final_date_creation: getTodayDate(),
        limit: 10,
    }
})

const fetchReport = async () => {
    const { error, data } = await request<any>('get', '/report', {
        page: page.value,
        limit: values.limit,
        initial_date_creation: values.initial_date_creation,
        final_date_creation: values.final_date_creation
    })

    if (!error) {
        reportData.items = data.data
        reportData.meta = data.meta
        return
    }

    show({ message: error, type: 'error' })
}

const loadReport = handleSubmit(async () => {
    page.value = 1
    await fetchReport()
})

const goToPage = async (targetPage: number) => {
    if (!reportData.meta) return

    if (targetPage < 1 || targetPage > reportData.meta.last_page) {
        return
    }

    page.value = targetPage
    await fetchReport()
}

const firstPage = async () => {
    await goToPage(1)
}

const nextPage = async () => {
    await goToPage(page.value + 1)
}

const prevPage = async () => {
    await goToPage(page.value - 1)
}

const lastPage = async () => {
    await goToPage(reportData.meta.last_page)
}

const visiblePages = computed(() => {
    if (!reportData.meta) return []

    const current = reportData.meta.current_page
    const last = reportData.meta.last_page

    const delta = 2

    let start = Math.max(1, current - delta)
    let end = Math.min(last, current + delta)

    const pages = []

    for (let i = start; i <= end; i++) {
        pages.push(i)
    }

    return pages
})

const getBadgeStatusVariant = (statusId: number): Variant => {
    const variants: Record<number, Variant> = {
        1: 'outline',      // WAITING
        2: 'ghost',        // PROCESSING
        3: 'default',      // SUCCEEDED
        4: 'destructive',  // FAILED
        5: 'outline',      // EXPIRED
        6: 'ghost',        // CANCELLED
    }

    return variants[statusId] ?? 'default'
}

watch(() => values.limit, async () => {
    page.value = 1
    await fetchReport()
})

onMounted(fetchReport)
</script>

<template>
    <div class="space-y-6">
        <AppTitle title="Relatórios em background" />

        <form class="space-y-4" @submit.prevent="loadReport">
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

        <CardContainer v-if="reportData.items.length" size="lg">
            <table class="w-full text-sm">
                <thead class="border-b">
                    <tr class="text-left">
                        <th class="p-2">Nome</th>
                        <th class="p-2">Registros</th>
                        <th class="p-2">Processados</th>
                        <th class="p-2">Criado</th>
                        <th class="p-2">Finalizado</th>
                        <th class="p-2">Status</th>
                        <th class="p-2">Arquivo</th>
                    </tr>
                </thead>

                <tbody>
                    <tr v-for="item in reportData.items" :key="item.id" class="border-b">
                        <td class="p-2">{{ item.report_name }}</td>
                        <td class="p-2">{{ item.total_records }}</td>
                        <td class="p-2">{{ item.processed_records }}%</td>

                        <td class="p-2">{{ item.created_at }}</td>
                        <td class="p-2">{{ item.finished_at ?? '-' }}</td>

                        <td class="p-2">
                            <BaseBadge :text="item.status_name" :variant="getBadgeStatusVariant(item.status_id)" />
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

            <div v-if="reportData.meta" class="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mt-4">
                <span class="text-sm text-gray-600">
                    Mostrando
                    {{ reportData.meta.from }}
                    até
                    {{ reportData.meta.to }}
                    de
                    {{ reportData.meta.total }}
                    registros
                </span>

                <div class="flex items-center gap-1">
                    <BaseButton size="sm" variant="outline" :disabled="page === 1 || loading" @click="firstPage">
                        «
                    </BaseButton>

                    <BaseButton size="sm" variant="outline" :disabled="page === 1 || loading" @click="prevPage">
                        ‹
                    </BaseButton>

                    <BaseButton v-for="p in visiblePages" :key="p" size="sm"
                        :variant="p === page ? 'default' : 'outline'" :disabled="loading" @click="goToPage(p)">
                        {{ p }}
                    </BaseButton>

                    <BaseButton size="sm" variant="outline" :disabled="page === reportData.meta.last_page || loading"
                        @click="nextPage">
                        ›
                    </BaseButton>

                    <BaseButton size="sm" variant="outline" :disabled="page === reportData.meta.last_page || loading"
                        @click="lastPage">
                        »
                    </BaseButton>
                </div>
            </div>
        </CardContainer>
    </div>
</template>
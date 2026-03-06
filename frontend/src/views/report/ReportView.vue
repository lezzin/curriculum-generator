<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue'
import { useToast } from '../../composables/useToast'
import { useForm } from 'vee-validate'
import { reportSchema, type ReportForm } from '../../validation/schemas/report.schema'
import { getTodayDate } from '../../helper/string.helper'

import AppTitle from '../../components/layout/AppTitle.vue'
import ReportFilters from '../../components/report/ReportFilters.vue'
import ReportTable from '../../components/report/ReportTable.vue'
import ReportPagination, { type Meta } from '../../components/report/ReportPagination.vue'
import { useAuthStore } from '../../stores/auth'
import { storeToRefs } from 'pinia'
import { useReportApi } from '../../composables/api/useReportApi'

const { user } = storeToRefs(useAuthStore())
const { loading, request } = useReportApi()
const { show } = useToast()

const page = ref(1)

const reportData = reactive<{
    items: any[],
    meta: Meta | null
}>({
    items: [],
    meta: null
})

const { handleSubmit, values } = useForm<ReportForm>({
    validationSchema: reportSchema,
    initialValues: {
        initial_date_creation: getTodayDate(),
        final_date_creation: getTodayDate(),
        limit: 10
    }
})

const fetchReport = async () => {
    const { data, error } = await request<any>('get', '/report', {
        user_uuid: user.value?.id,
        page: page.value,
        limit: values.limit,
        initial_date_creation: values.initial_date_creation,
        final_date_creation: values.final_date_creation
    })

    if (!error) {
        reportData.items = data.data
        reportData.meta = data.meta as Meta
        return
    }

    show({ message: error, type: 'error' })
}

const loadReport = handleSubmit(async () => {
    page.value = 1
    await fetchReport()
})

watch(() => values.limit, async () => {
    page.value = 1
    await fetchReport()
})

onMounted(fetchReport)
</script>

<template>
    <div class="space-y-6">
        <AppTitle title="Processamento de Relatórios" />

        <ReportFilters :loading="loading" @submit="loadReport" />

        <ReportTable :items="reportData.items" :loading="loading" />

        <ReportPagination v-if="(reportData?.items.length || 0) > 0 && reportData.meta" :meta="reportData.meta"
            :loading="loading" v-model:page="page" @change="fetchReport" />
    </div>
</template>
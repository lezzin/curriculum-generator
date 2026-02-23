<script setup lang="ts">
import { onMounted, reactive } from 'vue'
import { useApi } from '../composables/useApi'
import type { Resume } from '../interfaces/resume.interfaces'
import ResumePreview from '../components/resume/ResumePreview.vue'
import AppTitle from '../components/layout/AppTitle.vue'

const { api, request } = useApi()
const resumesList = reactive<Resume[]>([])

async function getResumes() {
    const data = await request(async () => {
        const response = await api.get("/resume/all")
        return response.data as Resume[]
    })

    if (!data) {
        resumesList.length = 0
        return
    }

    resumesList.length = 0
    resumesList.push(...data)
}

onMounted(() => {
    getResumes()
})
</script>

<template>
    <AppTitle title="Currículos Gerados" />

    <div class="grid gap-4">
        <ResumePreview v-for="resume in resumesList" :key="resume.id" :resume="resume" />
    </div>
</template>
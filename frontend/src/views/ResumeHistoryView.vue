<script setup lang="ts">
import { onMounted, reactive } from 'vue'
import { useApi } from '../composables/useApi'
import { sseService } from '../services/sse.service'
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

    resumesList.length = 0
    if (data) resumesList.push(...data)
}

sseService.on<Resume>("resume-generated", (data) => resumesList.unshift(data))

onMounted(getResumes)
</script>

<template>
    <AppTitle title="Currículos Gerados" />

    <div class="grid gap-4" v-if="resumesList.length > 0">
        <ResumePreview v-for="resume in resumesList" :key="resume.id" :resume="resume" />
    </div>
    <p v-else class="text-center text-gray-500">Nenhum currículo gerado ainda.</p>
</template>
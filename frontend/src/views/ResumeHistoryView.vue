<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { useApi } from '../composables/useApi'
import { sseService } from '../services/sse.service'
import type { Resume } from '../interfaces/resume.interfaces'
import ResumePreview from '../components/resume/ResumePreview.vue'
import AppTitle from '../components/layout/AppTitle.vue'
import LoadContainer from '../components/ui/LoadContainer.vue'
import { useToast } from '../composables/useToast'

const { api, request } = useApi()
const { show } = useToast()

const resumesList = reactive<Resume[]>([])
const isLoading = ref(true)

async function getResumes() {
    try {
        const data = await request(async () => {
            const response = await api.get("/resume/all")
            return response.data as Resume[]
        })

        resumesList.length = 0
        if (data) resumesList.push(...data)
    } catch (error: any) {
        show({
            message: error.message || "Erro ao carregar currículos.",
            type: "error",
        })
    } finally {
        isLoading.value = false
    }
}

sseService.on<Resume>("resume-generated", (data) => resumesList.unshift(data))

onMounted(getResumes)
</script>

<template>
    <AppTitle title="Currículos Gerados" />

    <LoadContainer :loading="isLoading">
        <div class="grid gap-4" v-if="resumesList.length > 0">
            <ResumePreview v-for="resume in resumesList" :key="resume.id" :resume="resume" />
        </div>
        <p v-else class="text-center text-gray-500">Nenhum currículo gerado ainda.</p>
    </LoadContainer>
</template>
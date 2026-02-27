<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { useApi } from '../../composables/useApi'
import { sseService } from '../../services/sse.service'
import type { Resume } from '../../interfaces/resume.interfaces'
import ResumePreview from '../../components/resume/ResumePreview.vue'
import AppTitle from '../../components/layout/AppTitle.vue'
import LoadContainer from '../../components/ui/LoadContainer.vue'
import { useToast } from '../../composables/useToast'
import { useAuth } from '../../composables/useAuth'

const { api, request } = useApi()
const { user } = useAuth()
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

sseService.on<Resume>("resume-generated", (data) => {
    if (data.userId !== user.value?.id) return
    resumesList.unshift(data)
})

onMounted(getResumes)
</script>

<template>
    <AppTitle title="Meus Currículos Gerados"
        subtitle="Acompanhe, visualize e gerencie os currículos criados com base nas vagas enviadas." />

    <LoadContainer :loading="isLoading">
        <div class="grid gap-4" v-if="resumesList.length > 0">
            <ResumePreview v-for="resume in resumesList" :key="resume.id" :resume="resume" />
        </div>
        <div v-else class="text-center space-y-3">
            <p class="text-gray-500">
                Você ainda não gerou nenhum currículo personalizado.
            </p>

            <router-link :to="{ name: 'ResumeGenerator' }" class="text-primary font-medium hover:underline">
                Criar meu primeiro currículo
            </router-link>
        </div>
    </LoadContainer>
</template>
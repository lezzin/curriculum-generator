<script setup lang="ts">
import { capitalize, ref } from "vue"
import { useApi } from "../../composables/useApi"
import BaseButton from "../../components/ui/BaseButton.vue"
import TextAreaField from "../../components/ui/form/TextAreaField.vue"
import SelectField from "../../components/ui/form/SelectField.vue"
import AppTitle from "../../components/layout/AppTitle.vue"
import { useToast } from "../../composables/useToast"
import { useForm } from "vee-validate"
import { INITIAL_VALUES, MAX_LENGTH, resumeSchema, type ResumeForm } from "../../components/validation/schemas/resume.schema"
import TemplatePreview from "../../components/resume/TemplatePreview.vue"
import BaseModal from "../../components/ui/modal/BaseModal.vue"
import { templateTypes } from "../../interfaces/resume.interfaces"
import SearchIcon from "../../components/icon/SearchIcon.vue"

const { show } = useToast()

const { handleSubmit, values } = useForm<ResumeForm>({
    validationSchema: resumeSchema,
    initialValues: INITIAL_VALUES
})

const { loading: isLoading, request } = useApi()

const isTemplatePreviewModalOpen = ref(false)

const generateResume = handleSubmit(async (form) => {
    const { error } = await request<string>('post', "/resume/generate", {
        jobDescription: form.jobText,
        options: {
            language: form.language,
            targetSeniority: form.seniority,
            focusArea: form.focusArea,
            market: form.market,
            template: form.templateType
        }
    })

    show(error ? { message: error, type: "error", } : 'Solicitação enviada para processamento!')
})
</script>

<template>
    <AppTitle title="Gerar Currículo Personalizado"
        subtitle="Crie um currículo estratégico com base em uma vaga específica." />

    <BaseModal :is-open="isTemplatePreviewModalOpen" @close="isTemplatePreviewModalOpen = false">
        <TemplatePreview :key="values.templateType" :template="values.templateType" />

        <template #footer>
            <div class="flex justify-end gap-2">
                <BaseButton variant="ghost" @click="isTemplatePreviewModalOpen = false">Fechar</BaseButton>
            </div>
        </template>
    </BaseModal>

    <form class="space-y-10" @submit.prevent="generateResume">
        <div class="space-y-4">
            <div class="grid md:grid-cols-2 gap-4">
                <SelectField label="Idioma do currículo" name="language">
                    <option value="PT">Português</option>
                    <option value="EN">Inglês</option>
                </SelectField>

                <SelectField label="Tipo de template" name="templateType">
                    <option v-for="type in templateTypes" :key="type" :value="type">
                        {{ capitalize(type) }}
                    </option>

                    <template #button-helper>
                        <BaseButton variant="outline" type="button" @click.stop="isTemplatePreviewModalOpen = true">
                            <SearchIcon /> Exemplo
                        </BaseButton>
                    </template>
                </SelectField>
            </div>

            <div class="grid md:grid-cols-3 gap-4">
                <SelectField label="Nível de senioridade" name="seniority">
                    <option value="Junior">Júnior</option>
                    <option value="Mid-level">Pleno</option>
                    <option value="Senior">Sênior</option>
                </SelectField>

                <SelectField label="Área principal de atuação" name="focusArea">
                    <option value="Backend">Backend</option>
                    <option value="Fullstack">Full Stack</option>
                    <option value="Microservices">Microsserviços</option>
                    <option value="DevOps">DevOps</option>
                </SelectField>

                <SelectField label="Mercado de destino" name="market">
                    <option value="Brazil">Brasil</option>
                    <option value="US">Estados Unidos</option>
                    <option value="Europe">Europa</option>
                </SelectField>
            </div>

            <div class="space-y-4">
                <TextAreaField label="Descrição completa da vaga" name="jobText" :rows="10" :max-length="MAX_LENGTH"
                    :show-length="true"
                    placeholder="Cole aqui a descrição completa da vaga. Quanto mais detalhes, melhor será a personalização do currículo." />

                <BaseButton type="submit" :disabled="isLoading" :loading="isLoading">
                    Gerar currículo personalizado
                </BaseButton>
            </div>
        </div>
    </form>
</template>
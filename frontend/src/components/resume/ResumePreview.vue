<script setup lang="ts">
import { ref, computed, onMounted } from "vue"
import { usePdf } from "../../composables/usePdf"
import type { Resume } from "../../interfaces/resume.interfaces"
import BaseButton from "../ui/BaseButton.vue"
import { toHumanReadableDate } from "../../helper/string.helper"
import CardContainer from "../ui/card/CardContainer.vue"
import RotateArrow from "../icon/RotateArrow.vue"

const props = defineProps<{ resume: Resume }>()

const isOpen = ref(false)
const shouldToggle = ref(false)
const resume = computed(() => props.resume)

const { setPublicPdfUrl, pdfUrl } = usePdf()

function togglePrompt() {
    isOpen.value = !isOpen.value
}

const shortPrompt = computed(() => {
    const prompt = resume.value.prompt ?? ""

    if (prompt.length > 120) {
        shouldToggle.value = true;
        return prompt.slice(0, 120);
    }

    shouldToggle.value = false;
    return prompt
})

const goToPdfUrl = async () => {
    if (!pdfUrl.value) return
    window.open(pdfUrl.value, "_blank");
};

onMounted(async () => {
    await setPublicPdfUrl(resume.value.id!)
})
</script>

<template>
    <div class="group border rounded-2xl px-5 pb-5 bg-white shadow-sm hover:shadow-md transition-all duration-200"
        @click="togglePrompt" :class="shouldToggle && 'cursor-pointer'">
        <div class="py-4 flex justify-between items-center gap-4">
            <small class="text-gray-500">Criado em: {{ toHumanReadableDate(resume.createdAt ?? "") }}</small>

            <div class="flex items-center gap-3">
                <RotateArrow :rotate="isOpen" v-if="shouldToggle" />

                <BaseButton v-if="resume.id" @click.stop="goToPdfUrl" size="sm" variant="outline" :disabled="!pdfUrl">
                    PDF
                </BaseButton>
            </div>
        </div>

        <CardContainer variant="text">
            {{ isOpen ? resume.prompt : shortPrompt }}
        </CardContainer>
    </div>
</template>
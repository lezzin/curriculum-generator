<script setup lang="ts">
import { useRouter } from "vue-router"
import BaseButton from "../components/ui/BaseButton.vue"

const router = useRouter()

function goToGenerator() {
    router.push("/curriculum")
}
</script>

<template>
    <section class="space-y-24">
        <div class="text-center space-y-6 py-20">
            <h1 class="text-4xl md:text-6xl font-bold leading-tight">
                Gere currículos personalizados com IA
            </h1>

            <p class="text-lg text-gray-600 max-w-2xl mx-auto">
                Cole a descrição da vaga e receba um currículo otimizado para o mercado,
                senioridade e área desejada — pronto para exportar em PDF.
            </p>

            <div class="flex justify-center gap-4 pt-4">
                <BaseButton size="lg" @click="goToGenerator">
                    Gerar Meu Currículo
                </BaseButton>

                <BaseButton size="lg" variant="outline" as="a" href="#how-it-works">
                    Como funciona
                </BaseButton>
            </div>
        </div>

        <div class="grid md:grid-cols-3 gap-8 text-center">
            <div class="p-6 border rounded-2xl">
                <h3 class="text-xl font-semibold mb-2">Personalizado</h3>
                <p class="text-gray-600">
                    Adaptado para a vaga específica, mercado internacional ou nacional.
                </p>
            </div>

            <div class="p-6 border rounded-2xl">
                <h3 class="text-xl font-semibold mb-2">Otimizado para ATS</h3>
                <p class="text-gray-600">
                    Estrutura pensada para passar por sistemas de triagem automática.
                </p>
            </div>

            <div class="p-6 border rounded-2xl">
                <h3 class="text-xl font-semibold mb-2">Pronto em minutos</h3>
                <p class="text-gray-600">
                    Sem formatação manual. Gere e exporte em PDF instantaneamente.
                </p>
            </div>
        </div>

        <div id="how-it-works" class="space-y-12 py-12">
            <h2 class="text-3xl font-bold text-center">
                Como funciona
            </h2>

            <div class="grid md:grid-cols-3 gap-8 text-center">
                <div class="space-y-2">
                    <div class="text-3xl font-bold">1</div>
                    <p class="font-medium">Cole a descrição da vaga</p>
                    <p class="text-gray-600 text-sm">
                        Insira os requisitos e responsabilidades da vaga desejada.
                    </p>
                </div>

                <div class="space-y-2">
                    <div class="text-3xl font-bold">2</div>
                    <p class="font-medium">Escolha suas preferências</p>
                    <p class="text-gray-600 text-sm">
                        Defina idioma, senioridade, área e mercado alvo.
                    </p>
                </div>

                <div class="space-y-2">
                    <div class="text-3xl font-bold">3</div>
                    <p class="font-medium">Baixe o PDF</p>
                    <p class="text-gray-600 text-sm">
                        Visualize e exporte seu currículo pronto para envio.
                    </p>
                </div>
            </div>
        </div>

        <div class="text-center py-20 border-t">
            <h2 class="text-3xl md:text-4xl font-bold mb-4">
                Pronto para aumentar suas chances?
            </h2>

            <p class="text-gray-600 mb-8">
                Gere um currículo estratégico e adaptado para cada vaga.
            </p>

            <BaseButton size="lg" @click="goToGenerator">
                Começar Agora
            </BaseButton>
        </div>
    </section>
</template>
<script setup lang="ts">
import BaseButton from "../components/ui/BaseButton.vue"
</script>

<template>
    <section class="space-y-24">
        <div class="text-center space-y-6 py-20">
            <h1 class="text-4xl md:text-6xl font-bold leading-tight">
                Gere conteúdos estratégicos para sua candidatura com IA
            </h1>

            <p class="text-lg text-gray-600 max-w-2xl mx-auto">
                Crie currículos personalizados, cartas de apresentação,
                propostas para freelances e descrições profissionais
                adaptadas para cada oportunidade — em minutos.
            </p>

            <div class="flex justify-center gap-4 pt-4">
                <BaseButton size="lg" as="router-link" to="/curriculum">
                    Começar a Gerar
                </BaseButton>

                <BaseButton size="lg" variant="outline" as="a" href="#how-it-works">
                    Como funciona
                </BaseButton>
            </div>
        </div>

        <div class="grid md:grid-cols-3 gap-8 text-center">
            <div class="p-6 border rounded-2xl">
                <h3 class="text-xl font-semibold mb-2">Adaptado à oportunidade</h3>
                <p class="text-gray-600">
                    Cada conteúdo é ajustado para a vaga, cliente ou projeto específico.
                </p>
            </div>

            <div class="p-6 border rounded-2xl">
                <h3 class="text-xl font-semibold mb-2">Profissional e estratégico</h3>
                <p class="text-gray-600">
                    Estrutura pensada para destacar suas habilidades e aumentar suas chances.
                </p>
            </div>

            <div class="p-6 border rounded-2xl">
                <h3 class="text-xl font-semibold mb-2">Rápido e prático</h3>
                <p class="text-gray-600">
                    Sem perder tempo com formatação manual. Gere, revise e utilize.
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
                    <p class="font-medium">Cole a descrição da oportunidade</p>
                    <p class="text-gray-600 text-sm">
                        Pode ser uma vaga CLT, projeto freelance ou chamada para proposta.
                    </p>
                </div>

                <div class="space-y-2">
                    <div class="text-3xl font-bold">2</div>
                    <p class="font-medium">Defina o tipo de conteúdo</p>
                    <p class="text-gray-600 text-sm">
                        Escolha entre currículo, proposta, carta ou descrição profissional.
                    </p>
                </div>

                <div class="space-y-2">
                    <div class="text-3xl font-bold">3</div>
                    <p class="font-medium">Gere e utilize</p>
                    <p class="text-gray-600 text-sm">
                        Copie, edite se quiser e envie com confiança.
                    </p>
                </div>
            </div>
        </div>

        <div class="text-center py-20 border-t">
            <h2 class="text-3xl md:text-4xl font-bold mb-4">
                Pronto para se candidatar com mais estratégia?
            </h2>

            <p class="text-gray-600 mb-8">
                Gere conteúdos personalizados para cada oportunidade e aumente suas chances.
            </p>

            <BaseButton size="lg" as="router-link" to="/curriculum">
                Começar Agora
            </BaseButton>
        </div>
    </section>
</template>
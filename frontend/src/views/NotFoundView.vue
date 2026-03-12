<script setup lang="ts">
import BaseButton from '../components/ui/BaseButton.vue';
</script>

<template>
  <section class="space-y-24">
    <div class="text-center space-y-6 py-24">
      <p class="text-sm font-semibold text-gray-400 tracking-widest">ERRO 404</p>

      <h1 class="text-4xl md:text-6xl font-bold leading-tight">Página não encontrada</h1>

      <p class="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
        A página que você tentou acessar não existe ou pode ter sido movida. Mas você ainda pode continuar criando
        conteúdos estratégicos para suas candidaturas.
      </p>

      <div class="flex flex-wrap justify-center gap-4 pt-6">
        <BaseButton size="lg" as="router-link" :to="{ name: 'Home' }"> Ir para início </BaseButton>

        <BaseButton size="lg" variant="outline" as="router-link" :to="{ name: 'ResumeGenerate' }">
          Gerar currículo
        </BaseButton>
      </div>
    </div>

    <div class="max-w-4xl mx-auto">
      <h2 class="text-2xl font-semibold text-center mb-10">Talvez você esteja procurando por:</h2>

      <div class="grid md:grid-cols-3 gap-6 text-center">
        <router-link :to="{ name: 'ResumeGenerate' }"
          class="p-6 border dark:border-zinc-800 rounded-2xl hover:shadow-md transition">
          <h3 class="font-semibold mb-2">Gerar currículo</h3>
          <p class="text-gray-600 text-sm">Crie um currículo personalizado com IA.</p>
        </router-link>

        <router-link :to="{ name: 'FreelanceProposalGenerate' }"
          class="p-6 border dark:border-zinc-800 rounded-2xl hover:shadow-md transition">
          <h3 class="font-semibold mb-2">Gerar proposta</h3>
          <p class="text-gray-600 text-sm">Crie propostas profissionais para freelances.</p>
        </router-link>

        <router-link :to="{ name: 'Profile' }"
          class="p-6 border dark:border-zinc-800 rounded-2xl hover:shadow-md transition">
          <h3 class="font-semibold mb-2">Seu perfil</h3>
          <p class="text-gray-600 text-sm">Gerencie suas informações e preferências.</p>
        </router-link>
      </div>
    </div>
  </section>
</template>

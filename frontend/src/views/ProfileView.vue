<script setup lang="ts">
import CardContainer from '../components/ui/card/CardContainer.vue';
import { useAuth } from '../composables/useAuth';
const { user } = useAuth()
</script>

<template>
    <header class="flex flex-col">
        <p class="text-lg">{{ user?.name }}</p>
        <p>{{ user?.email }}</p>
    </header>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <CardContainer class="space-y-4">
            <h2>Dados base para currículo</h2>

            <CardContainer variant="text" size="sm">
                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Fugit qui maiores consequuntur autem sequi.
                Nam illo eum pariatur sit quisquam fugiat mollitia corporis doloremque officiis quibusdam dolore a
                dolorem architecto, aspernatur beatae voluptas tempore impedit! Ratione commodi nesciunt quae ullam
                deleniti consequatur optio, labore voluptate illum aliquam ducimus soluta, consequuntur quasi dolores
                earum enim. Doloremque, in facere. At, nemo eligendi?
            </CardContainer>
        </CardContainer>

        <CardContainer class="space-y-4">
            <h2>Dados base para propostas de freelance</h2>

            <CardContainer variant="text" size="sm">
                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Fugit qui maiores consequuntur autem sequi.
                Nam illo eum pariatur sit quisquam fugiat mollitia corporis doloremque officiis quibusdam dolore a
                dolorem architecto, aspernatur beatae voluptas tempore impedit! Ratione commodi nesciunt quae ullam
                deleniti consequatur optio, labore voluptate illum aliquam ducimus soluta, consequuntur quasi dolores
                earum enim. Doloremque, in facere. At, nemo eligendi?
            </CardContainer>
        </CardContainer>
    </div>
</template>
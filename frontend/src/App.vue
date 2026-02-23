<script setup lang="ts">
import AppContainer from './components/layout/AppContainer.vue';
import AppHeader from './components/layout/AppHeader.vue';
import BaseToast from './components/ui/BaseToast.vue';

</script>

<template>
  <AppHeader />

  <AppContainer class="p-8 space-y-8">
    <router-view></router-view>
    <BaseToast />
  </AppContainer>
</template>

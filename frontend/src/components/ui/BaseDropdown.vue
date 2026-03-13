<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';

const isOpen = ref(false);
const dropdownRef = ref<HTMLElement | null>(null);

function toggle() {
  isOpen.value = !isOpen.value;
}

function close() {
  isOpen.value = false;
}

function handleClickOutside(event: MouseEvent) {
  if (!dropdownRef.value?.contains(event.target as Node)) {
    close();
  }
}

function handleEscape(event: KeyboardEvent) {
  if (event.key === 'Escape') close();
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
  document.addEventListener('keydown', handleEscape);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
  document.removeEventListener('keydown', handleEscape);
});
</script>

<template>
  <div ref="dropdownRef" class="relative">
    <slot name="trigger" :toggle="toggle" :isOpen="isOpen" />

    <transition name="dropdown">
      <div v-if="isOpen" class="absolute mt-3 w-56 bg-app-surface rounded-2xl shadow-xl border border-app-border py-2 z-50">
        <slot :close="close" />
      </div>
    </transition>
  </div>
</template>

<style scoped lang="postcss">
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.18s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-6px) scale(0.98);
}

.dropdown-item {
  @apply block w-full px-4 py-2 text-gray-600 hover:bg-gray-100 hover:text-black transition;
}
</style>

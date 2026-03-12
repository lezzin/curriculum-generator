<script setup lang="ts">
import { onBeforeUnmount, ref, watch, nextTick } from 'vue';
import CloseIcon from '../../icon/CloseIcon.vue';

interface Props {
  isOpen: boolean;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  persistent?: boolean;
}

interface Emits {
  (e: 'update:isOpen', value: boolean): void;
  (e: 'close'): void;
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  persistent: false,
});

const emit = defineEmits<Emits>();
const modalRef = ref<HTMLElement | null>(null);
const previouslyFocusedElement = ref<HTMLElement | null>(null);

const close = () => {
  if (props.persistent) return;
  emit('update:isOpen', false);
  emit('close');
};

const handleEsc = (e: KeyboardEvent) => {
  if (e.key === 'Escape') close();
};

const trapFocus = (e: KeyboardEvent) => {
  if (e.key !== 'Tab' || !modalRef.value) return;

  const focusableElements = modalRef.value.querySelectorAll<HTMLElement>(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  if (e.shiftKey) {
    if (document.activeElement === firstElement) {
      lastElement?.focus();
      e.preventDefault();
    }
  } else {
    if (document.activeElement === lastElement) {
      firstElement?.focus();
      e.preventDefault();
    }
  }
};

watch(
  () => props.isOpen,
  async (open) => {
    if (open) {
      previouslyFocusedElement.value = document.activeElement as HTMLElement;
      window.addEventListener('keydown', handleEsc);
      window.addEventListener('keydown', trapFocus);
      await nextTick();
      modalRef.value?.querySelector<HTMLElement>('button, input, [tabindex]')?.focus();
      document.body.style.overflow = 'hidden';
    } else {
      window.removeEventListener('keydown', handleEsc);
      window.removeEventListener('keydown', trapFocus);
      previouslyFocusedElement.value?.focus();
      document.body.style.overflow = '';
    }
  }
);

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleEsc);
  window.removeEventListener('keydown', trapFocus);
  document.body.style.overflow = '';
});

const sizeClasses = {
  sm: 'max-w-md',
  md: 'max-w-2xl',
  lg: 'max-w-4xl',
  xl: 'max-w-6xl',
};
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="close" />

        <Transition name="scale">
          <div
            ref="modalRef"
            class="relative bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl w-full max-h-[90vh] overflow-hidden flex flex-col border dark:border-zinc-800"
            :class="sizeClasses[size]"
            role="dialog"
            aria-modal="true"
            :aria-labelledby="title ? 'modal-title' : undefined"
          >
            <div v-if="title" class="flex items-center justify-between px-6 py-4 border-b dark:border-zinc-800">
              <h2 id="modal-title" class="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                {{ title }}
              </h2>

              <button
                class="p-2 -mr-2 text-gray-500 hover:text-gray-800 dark:hover:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full transition"
                @click="close"
                aria-label="Fechar modal"
              >
                <CloseIcon />
              </button>
            </div>

            <div class="p-6 overflow-y-auto">
              <slot />
            </div>

            <div v-if="$slots.footer" class="px-6 py-4 border-t dark:border-zinc-800 bg-gray-50 dark:bg-zinc-800/50">
              <slot name="footer" />
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.scale-enter-active,
.scale-leave-active {
  transition: all 0.2s ease;
}

.scale-enter-from,
.scale-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>

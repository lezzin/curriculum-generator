import { ref, computed } from 'vue';

export function useToggleText(text: string | null | undefined, limit = 120) {
  const isOpen = ref(false);

  const shouldToggle = computed(() => (text?.length || 0) > limit);

  const displayText = computed(() => {
    if (!text) return '';
    if (isOpen.value || !shouldToggle.value) return text;
    return `${text.slice(0, limit)}...`;
  });

  function toggle() {
    if (shouldToggle.value) {
      isOpen.value = !isOpen.value;
    }
  }

  return {
    isOpen,
    shouldToggle,
    displayText,
    toggle,
  };
}

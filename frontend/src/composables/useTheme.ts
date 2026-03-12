import { ref, onMounted, watch } from 'vue';

const isDark = ref(localStorage.getItem('theme') === 'dark');

export function useTheme() {
  const toggleTheme = () => {
    isDark.value = !isDark.value;
  };

  const applyTheme = () => {
    if (isDark.value) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  onMounted(applyTheme);

  watch(isDark, applyTheme);

  return {
    isDark,
    toggleTheme,
  };
}

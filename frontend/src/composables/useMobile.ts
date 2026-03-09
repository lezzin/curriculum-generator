import { ref, onMounted, onUnmounted } from 'vue';

export function useMobile() {
    const isMobile = ref(false);

    const mediaQuery = window.matchMedia('(max-width: 767px)');

    const update = () => {
        isMobile.value = mediaQuery.matches;
    };

    onMounted(() => {
        update();
        mediaQuery.addEventListener('change', update);
    });

    onUnmounted(() => {
        mediaQuery.removeEventListener('change', update);
    });

    return {
        isMobile
    };
}
import { computed, ref } from "vue"

const authToken = ref<string | null>(localStorage.getItem('authToken'));

export function useAuth() {
    const isAuthenticated = computed(() => !!authToken.value);

    function setToken(token: string) {
        authToken.value = token;
        localStorage.setItem('authToken', token);
    }

    function clearToken() {
        authToken.value = null;
        localStorage.removeItem('authToken');
    }

    return {
        setToken,
        clearToken,
        isAuthenticated,
        authToken,
    }
}
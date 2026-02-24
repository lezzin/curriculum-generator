import { computed, ref } from "vue"

const authToken = ref<string | null>(localStorage.getItem('authToken'));
const userId = ref<string | null>(localStorage.getItem('userId'));

export function useAuth() {
    const isAuthenticated = computed(() => !!authToken.value);

    function setToken(token: string, userIdValue: string) {
        authToken.value = token;
        userId.value = userIdValue;

        localStorage.setItem('authToken', token);
        localStorage.setItem('userId', userIdValue);
    }

    function clearToken() {
        authToken.value = null;
        userId.value = null;
        localStorage.removeItem('authToken');
        localStorage.removeItem('userId');
    }

    return {
        setToken,
        clearToken,
        isAuthenticated,
        userId: computed(() => userId.value),
        authToken: computed(() => authToken.value)
    }
}
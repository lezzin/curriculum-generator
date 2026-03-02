import { ref } from "vue"
import { defineStore } from "pinia"
import { api } from "../services/api/api";

export type User = {
    id: number;
    name: string;
    email: string;
    picture: string;
}

export const useAuthStore = defineStore('auth', () => {
    const user = ref<User | null>(null);
    const isAuthLoading = ref(false);

    const checkAuth = async () => {
        isAuthLoading.value = true;

        try {
            const { data } = await api.get<User>('/auth/me');
            user.value = data;
        } catch {
            user.value = null;
        } finally {
            isAuthLoading.value = false;
        }
    };

    const logout = async () => {
        await api.post('/auth/logout');
        user.value = null;
    };

    return { user, isAuthLoading, checkAuth, logout };
});
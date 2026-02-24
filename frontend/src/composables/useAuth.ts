import { ref } from "vue"
import { useApi } from "./useApi";

type User = {
    id: number;
    name: string;
    email: string;
}

const { request, api } = useApi()
const user = ref<User | null>(null);
const isAuthLoading = ref(true);

export function useAuth() {
    const checkAuth = async () => {
        isAuthLoading.value = true;

        try {
            const response = await request(() => api.get("/auth/me"));
            user.value = response.data;
        } catch (err: any) {
            user.value = null;
        } finally {
            isAuthLoading.value = false;
        }
    };

    const logout = async () => {
        await api.post("/auth/logout");
        user.value = null;
    }

    return {
        checkAuth,
        logout,
        user,
        isAuthLoading,
    }
}
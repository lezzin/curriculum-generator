// composables/usePaginated.ts
import { ref, computed, shallowRef } from 'vue';
import type { PaginatedResult } from '../interfaces/paginate.interfaces';
import type { AxiosInstance } from 'axios';

export function usePaginated<T>(api: AxiosInstance, endpoint: string, pageSize = 10) {
    const items = shallowRef<T[]>([]);
    const total = ref(0);
    const page = ref(1);
    const isFetching = ref(false);
    const itemMap = new Map<string, boolean>();

    const hasMore = computed(() => total.value > 0 && items.value.length < total.value);

    function addUnique(newItems: T[], getId: (item: T) => string) {
        const uniqueItems: T[] = [];

        for (const item of newItems) {
            const id = getId(item);
            if (!itemMap.has(id)) {
                itemMap.set(id, true);
                uniqueItems.push(item);
            }
        }

        items.value = [...items.value, ...uniqueItems];
    }

    async function fetch(getId: (item: T) => string) {
        if (isFetching.value) return;
        if (!hasMore.value && total.value !== 0) return;

        isFetching.value = true;

        try {
            const { data } = await api.get<PaginatedResult<T>>(endpoint, { params: { page: page.value, limit: pageSize } });
            total.value = data.total;
            addUnique(data.data, getId);
            page.value++;
        } finally {
            isFetching.value = false;
        }
    }

    function remove(itemId: string, getId: (item: T) => string) {
        items.value = items.value.filter(item => getId(item) !== itemId);
        itemMap.delete(itemId);
        total.value--;
    }

    function prepend(item: T, getId: (item: T) => string) {
        const id = getId(item);
        if (itemMap.has(id)) return;

        itemMap.set(id, true);
        items.value.unshift(item);
        total.value++;
    }

    return { items, total, hasMore, isFetching, fetch, remove, prepend };
}
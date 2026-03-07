<script setup lang="ts">
import { computed } from 'vue';
import type { ProcessStatus } from '../../types/report.types';
import BaseBadge from '../ui/BaseBadge.vue'
import type { Variant } from '../ui/BaseBadge.vue'

const props = defineProps<{
    statusId: ProcessStatus
    text: string
}>()

const variants: Record<ProcessStatus, Variant> = {
    1: 'outline',
    2: 'info',
    3: 'success',
    4: 'destructive',
    5: 'warning',
    6: 'destructive'
}

const variant = computed(() => variants[props.statusId] ?? 'default')
</script>

<template>
    <BaseBadge :text="text" :variant="variant" />
</template>
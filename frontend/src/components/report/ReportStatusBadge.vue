<script setup lang="ts">
import BaseBadge from '../ui/BaseBadge.vue'
import type { Variant } from '../ui/BaseBadge.vue'

const props = defineProps<{
    statusId: number
    text: string
}>()

const variants: Record<number, Variant> = {
    1: 'outline',
    2: 'ghost',
    3: 'default',
    4: 'destructive',
    5: 'outline',
    6: 'ghost'
}

const variant = variants[props.statusId] ?? 'default'
</script>

<template>
    <BaseBadge :text="text" :variant="variant" />
</template>
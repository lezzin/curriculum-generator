<script setup lang="ts">
import { computed } from 'vue'
import { getFirstLetter } from '../../helper/string.helper'
import type { User } from '../../stores/auth'

type Size = 'sm' | 'md' | 'lg'

interface Props {
    user: User
    size?: Size
}

const props = withDefaults(defineProps<Props>(), {
    size: 'md'
})

const sizeMap: Record<Size, { container: string; text: string }> = {
    lg: { container: 'w-16 h-16', text: 'text-xl' },
    md: { container: 'w-12 h-12', text: 'text-lg' },
    sm: { container: 'w-9 h-9', text: 'text-sm' }
}

const containerClasses = computed(() => [
    'rounded-full',
    'overflow-hidden',
    'flex',
    'items-center',
    'justify-center',
    'bg-gray-900',
    'text-white',
    'font-semibold',
    sizeMap[props.size].container,
    sizeMap[props.size].text
])

const altText = computed(
    () => `Foto de perfil de ${props.user?.name ?? 'usuário'}`
)

const firstLetter = computed(() =>
    getFirstLetter(props.user?.name ?? '')
)
</script>

<template>
    <div :class="containerClasses">
        <img v-if="user.picture" :src="user.picture" :alt="altText" class="w-full h-full object-cover" />
        <span v-else>
            {{ firstLetter }}
        </span>
    </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import type { FreelanceProposal } from '../../interfaces/freelance.interfaces';
import BaseButton from '../ui/BaseButton.vue';
import { toHumanReadableDate } from '../../helper/string.helper';
import CardContainer from '../ui/card/CardContainer.vue';
import { useToast } from '../../composables/useToast';
import { useApi } from '../../composables/api/useApi';
import { useToggleText } from '../../composables/useToggleText';
import ConfirmModal from '../ui/modal/ConfirmModal.vue';
import CopyIcon from '../icon/CopyIcon.vue';
import SuccessIcon from '../icon/SuccessIcon.vue';
import TrashIcon from '../icon/TrashIcon.vue';

interface Props {
  proposal: FreelanceProposal;
}

interface Emits {
  (e: 'remove'): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const { show } = useToast();
const { request, loading } = useApi();
const { displayText, toggle } = useToggleText(props.proposal?.prompt);

const showConfirmModal = ref(false);
const isCopied = ref(false)

const removeProposal = async () => {
  const { error } = await request('post', '/freelance/proposal/remove', {
    proposal_id: props.proposal.id,
  });

  if (!error) {
    show({ message: 'Proposta removida com sucesso.', type: 'success' });
    emit('remove');
    return;
  }

  show({ message: error, type: 'error' });
};

async function copyProposal() {
  if (!props.proposal.message) return;

  try {
    await navigator.clipboard.writeText(props.proposal.message);
    show({ message: 'Copiado com sucesso!', duration: 1500 });
    isCopied.value = true;
    setTimeout(() => isCopied.value = false, 2000);
  } catch (error) {
    console.error('Erro ao copiar:', error);
    show({ message: 'Erro ao copiar', type: 'error' });
  }
}
</script>

<template>
  <div v-if="proposal"
    class="rounded-2xl p-6 space-y-5 shadow-sm bg-white border border-zinc-200 transition-all duration-300">
    <div class="flex items-center justify-between">
      <small class="text-gray-500">
        Criado em:
        {{ toHumanReadableDate(proposal.createdAt ?? '') }}
      </small>

      <div class="flex items-center gap-3">
        <BaseButton @click="copyProposal" variant="outline" size="sm"
          :class="{ '!border-green-500 !text-green-600': isCopied }">
          <SuccessIcon v-if="isCopied" />
          <CopyIcon v-else />
        </BaseButton>

        <BaseButton @click.stop="showConfirmModal = true" size="sm" variant="destructive" :disabled="loading">
          <TrashIcon />
        </BaseButton>
      </div>
    </div>

    <div class="space-y-1">
      <label class="text-sm font-medium text-zinc-700"> Solicitação </label>

      <CardContainer variant="text" @click="toggle" size="sm">
        {{ displayText }}
      </CardContainer>
    </div>

    <div class="space-y-1">
      <label class="text-sm font-medium text-zinc-700"> Proposta </label>

      <textarea v-model="proposal.message" rows="8"
        class="w-full resize-none text-sm leading-relaxed rounded-xl p-4 bg-zinc-50 text-zinc-700 border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300" />
    </div>
  </div>

  <ConfirmModal :is-open="showConfirmModal" @cancel="showConfirmModal = false" @confirm="removeProposal" />
</template>

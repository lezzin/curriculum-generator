import { ref, readonly } from 'vue';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: number;
  message: string;
  type: ToastType;
  duration: number;
  link?: {
    label: string;
    to: string;
    external?: boolean;
  };
}

type ToastOptions = Omit<Toast, 'id' | 'type' | 'duration'> & {
  message: string;
  type?: ToastType;
  duration?: number;
};

type ToastInput = string | ToastOptions;

const state = ref<Toast[]>([]);
let idCounter = 0;

const DEFAULTS: Pick<Toast, 'type' | 'duration'> = {
  type: 'success',
  duration: 4000,
};

function normalizeToast(input: ToastInput): Toast {
  if (typeof input === 'string') {
    return {
      id: idCounter++,
      message: input,
      ...DEFAULTS,
    };
  }

  return {
    id: idCounter++,
    ...DEFAULTS,
    ...input,
  };
}

export function useToast() {
  function show(input: ToastInput | null) {
    if (!input) return;
    const toast = normalizeToast(input);

    state.value.push(toast);

    if (toast.duration > 0) {
      setTimeout(() => remove(toast.id), toast.duration);
    }
  }

  function remove(id: number) {
    state.value = state.value.filter((t) => t.id !== id);
  }

  function clear() {
    state.value = [];
  }

  return {
    toasts: readonly(state),
    show,
    remove,
    clear,
  };
}

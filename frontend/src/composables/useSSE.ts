import { onMounted, onUnmounted } from 'vue';
import { sseService } from '../services/sse.service';

export function useSSE<T = any>(eventName: string, callback: (data: T) => void) {
  onMounted(() => {
    sseService.on(eventName, callback);
  });

  onUnmounted(() => {
    sseService.off(eventName, callback);
  });
}

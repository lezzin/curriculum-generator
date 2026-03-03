import type { AxiosInstance } from 'axios';

type SSECallback<T = any> = (payload: T) => void;

class SSEService {
  private api!: AxiosInstance;
  private eventSource: EventSource | null = null;
  private listeners = new Map<string, SSECallback[]>();
  private reconnectInterval = 3000;

  init(api: AxiosInstance) {
    if (this.eventSource) return;
    this.api = api;
    this.connect();
  }

  private connect() {
    if (!this.api) return console.error('SSEService: API não inicializada');

    const url = `${this.api.defaults.baseURL}/events/connect`;
    this.eventSource = new EventSource(url, { withCredentials: true });

    this.eventSource.addEventListener('message', (e) => this.emitEvent('message', e.data));
    this.eventSource.addEventListener('resume-generated', (e) => this.emitEvent('resume-generated', e.data));
    this.eventSource.addEventListener('proposal-generated', (e) => this.emitEvent('proposal-generated', e.data));

    this.eventSource.onerror = () => {
      console.warn('SSE desconectado, tentando reconectar...');
      this.eventSource?.close();
      this.eventSource = null;
      setTimeout(() => this.connect(), this.reconnectInterval);
    };
  }

  private emitEvent(eventName: string, data: any) {
    let parsed = null;

    try {
      parsed = typeof data === 'string' ? JSON.parse(data) : data;
    } catch (err) {
      console.error('Erro ao obter payload SSE:', err);
    }

    this.listeners.get(eventName)?.forEach((cb) => cb(parsed));
  }

  on<T>(eventName: string, callback: SSECallback<T>) {
    if (!this.listeners.has(eventName)) this.listeners.set(eventName, []);
    this.listeners.get(eventName)!.push(callback);
  }

  off(eventName: string, callback?: SSECallback) {
    if (!callback) return this.listeners.delete(eventName);
    const arr = this.listeners.get(eventName) || [];
    this.listeners.set(
      eventName,
      arr.filter((cb) => cb !== callback)
    );
  }

  close() {
    this.eventSource?.close();
    this.eventSource = null;
    this.listeners.clear();
  }
}

export const sseService = new SSEService();

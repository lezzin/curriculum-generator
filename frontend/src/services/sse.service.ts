import type { AxiosInstance } from 'axios';

type SSECallback<T = any> = (payload: T) => void;

class SSEService {
  private api!: AxiosInstance;
  private eventSource: EventSource | null = null;
  private listeners = new Map<string, SSECallback[]>();
  private registeredEvents = new Set<string>();
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

    this.eventSource.onerror = () => {
      console.warn('SSE desconectado, tentando reconectar...');
      this.eventSource?.close();
      this.eventSource = null;
      this.registeredEvents.clear();

      setTimeout(() => this.connect(), this.reconnectInterval);
    };

    this.listeners.forEach((_, eventName) => {
      this.registerEvent(eventName);
    });
  }

  private registerEvent(eventName: string) {
    if (!this.eventSource || this.registeredEvents.has(eventName)) return;

    this.eventSource.addEventListener(eventName, (e: MessageEvent) => {
      this.emitEvent(eventName, e.data);
    });

    this.registeredEvents.add(eventName);
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
    if (!this.listeners.has(eventName)) {
      this.listeners.set(eventName, []);
    }

    this.listeners.get(eventName)!.push(callback);

    this.registerEvent(eventName);
  }

  off(eventName: string, callback?: SSECallback) {
    if (!callback) {
      this.listeners.delete(eventName);
      return;
    }

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
    this.registeredEvents.clear();
  }
}

export const sseService = new SSEService();
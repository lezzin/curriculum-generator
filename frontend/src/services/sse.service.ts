import type { AxiosInstance } from 'axios';

type SSECallback<T = any> = (payload: T) => void;

class SSEService {
  private api!: AxiosInstance;
  private eventSource: EventSource | null = null;
  private listeners = new Map<string, SSECallback[]>();
  private registeredEvents = new Map<string, EventListener>();
  private reconnectInterval = 3000;
  private isConnecting = false;

  init(api: AxiosInstance) {
    if (this.eventSource || this.isConnecting) return;
    this.api = api;
    this.connect();
  }

  private connect() {
    if (!this.api) return console.error('SSEService: API não inicializada');
    if (this.isConnecting) return;

    this.isConnecting = true;

    const url = `${this.api.defaults.baseURL}/events/connect`;
    this.eventSource = new EventSource(url, { withCredentials: true });

    this.eventSource.onerror = () => {
      console.warn('SSE desconectado, tentando reconectar...');
      this.cleanupEventSource();
      setTimeout(() => this.connect(), this.reconnectInterval);
    };

    this.registeredEvents.forEach((_, eventName) => {
      this.registerEvent(eventName);
    });

    this.isConnecting = false;
  }

  private cleanupEventSource() {
    if (!this.eventSource) return;

    this.registeredEvents.forEach((listener, eventName) => {
      this.eventSource?.removeEventListener(eventName, listener);
    });

    this.eventSource.close();
    this.eventSource = null;
    this.registeredEvents.clear();
  }

  private registerEvent(eventName: string) {
    if (!this.eventSource) return;
    if (this.registeredEvents.has(eventName)) return;

    const listener: EventListener = (e: Event) => {
      const me = e as MessageEvent;
      this.emitEvent(eventName, me.data);
    };

    this.eventSource.addEventListener(eventName, listener);
    this.registeredEvents.set(eventName, listener);
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
      const listener = this.registeredEvents.get(eventName);
      if (listener) this.eventSource?.removeEventListener(eventName, listener);
      this.registeredEvents.delete(eventName);
      return;
    }

    const arr = this.listeners.get(eventName) || [];

    this.listeners.set(
      eventName,
      arr.filter((cb) => cb !== callback)
    );

    if ((this.listeners.get(eventName) || []).length === 0) {
      const listener = this.registeredEvents.get(eventName);
      if (listener) this.eventSource?.removeEventListener(eventName, listener);
      this.registeredEvents.delete(eventName);
      this.listeners.delete(eventName);
    }
  }

  close() {
    this.cleanupEventSource();
    this.listeners.clear();
  }
}

export const sseService = new SSEService();

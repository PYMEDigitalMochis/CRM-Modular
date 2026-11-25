/** Bus en memoria: sin persistencia, sin reintentos y sin entrega remota. */
export interface CoreEvent {
  readonly tipo: string;
  readonly version: number;
  readonly ocurrido_en: string;
  readonly origen: string;
  readonly id_entidad: string;
}
export type EventHandler<E extends CoreEvent = CoreEvent> = (event: E) => void;
export class EventBus<E extends CoreEvent = CoreEvent> {
  private readonly listeners = new Map<string, Set<EventHandler<E>>>();
  readonly errors: Error[] = [];
  subscribe(type: string, handler: EventHandler<E>): () => void {
    const handlers = this.listeners.get(type) ?? new Set<EventHandler<E>>();
    handlers.add(handler);
    this.listeners.set(type, handlers);
    return () => { handlers.delete(handler); if (!handlers.size) this.listeners.delete(type); };
  }
  publish(event: E): void {
    if (!event.tipo || event.version < 1 || !event.origen || !event.id_entidad || Number.isNaN(Date.parse(event.ocurrido_en))) {
      throw new Error('Evento inválido');
    }
    for (const fn of [...(this.listeners.get(event.tipo) ?? [])]) {
      try { fn(event); } catch (cause) { this.errors.push(cause instanceof Error ? cause : new Error(String(cause))); }
    }
  }
}
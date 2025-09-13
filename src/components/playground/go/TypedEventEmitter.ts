type Event<EM extends object, N extends keyof EM> =
  EM[N] extends undefined
    ? { type: N }
    : { type: N, details: EM[N] };

type EventListener<EM extends object, N extends keyof EM> = (event: Event<EM, N>) => void;

type EventListenerMap<EM extends object> = {
  [K in keyof EM]?: EventListener<EM, K>[]
};


export class TypedEventEmitter<EM extends object> {

  private readonly listeners: EventListenerMap<EM> = {};

  public addEventListener<N extends keyof EM>(eventName: N, listener: EventListener<EM, N>): void {
    this.listeners[eventName] ??= [];
    this.listeners[eventName].push(listener);
  }

  public removeEventListener<N extends keyof EM>(eventName: N, listener: EventListener<EM, N>): void {
    const listeners = this.listeners[eventName] ?? [];
    const index = listeners.findIndex(l => l === listener);
    if (index !== -1) {
      listeners.splice(index, 1);
    }
  }

  protected dispatchCustomEvent<N extends keyof EM>(
    eventName: N,
    ...args: EM[N] extends undefined ? [] : [EM[N]]
  ): void {
    const event = (!args.length
      ? { type: eventName }
      : { type: eventName, details: args[0] }) as Event<EM, N>;

    const listeners = this.listeners[eventName];
    listeners?.forEach(listener => listener(event));
  }

}

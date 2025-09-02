type GoGameServiceEventMap = {
  gameCreated: { gameId: string }
};

type GoGameServiceEventName = keyof GoGameServiceEventMap;

type GoGameServiceEvent<T extends GoGameServiceEventName> =
  GoGameServiceEventMap[T] extends undefined
    ? { type: T }
    : { type: T, details: GoGameServiceEventMap[T] };

type GoGameServiceEventHandlerCallback<T extends GoGameServiceEventName> = (event: GoGameServiceEvent<T>) => void;

type GoGameServiceEventHandlerMap = {
  [K in GoGameServiceEventName]?: GoGameServiceEventHandlerCallback<K>[]
};


export class GoGameServiceEventEmitter {

  private readonly eventListeners: GoGameServiceEventHandlerMap = {};

  public addEventListener<K extends GoGameServiceEventName>(eventName: K, listener: GoGameServiceEventHandlerCallback<K>): void {
    this.eventListeners[eventName] ??= [];
    this.eventListeners[eventName].push(listener);
  }

  public removeEventListener<K extends GoGameServiceEventName>(eventName: K, listener: GoGameServiceEventHandlerCallback<K>): void {
    const listeners = this.eventListeners[eventName] ?? [];
    const index = listeners.findIndex(l => l === listener);
    if (index !== -1) {
      listeners.splice(index, 1);
    }
  }

  protected dispatchEvent<T extends GoGameServiceEventName>(
    eventName: T,
    ...args: GoGameServiceEventMap[T] extends undefined ? [] : [GoGameServiceEventMap[T]]
  ): void {
    const event = (!args.length
      ? { type: eventName }
      : { type: eventName, details: args[0] }) as GoGameServiceEvent<T>;

    const listeners = this.eventListeners[eventName];
    listeners?.forEach(listener => listener(event));
  }

}

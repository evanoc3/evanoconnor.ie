type Object = Record<string|number|symbol, any>;

export function dispatchCustomEvent<T extends Object>(element: HTMLElement, eventName: string, detail?: T): void;
export function dispatchCustomEvent(element: HTMLElement, eventName: string): void;
export function dispatchCustomEvent<T extends Object>(element: HTMLElement, eventName: string, detail?: T): void {
  element.dispatchEvent(new CustomEvent<T>(eventName, {
    bubbles: true,
    composed: true,
    detail
  }));
}

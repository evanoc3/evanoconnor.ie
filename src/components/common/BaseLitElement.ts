import { LitElement } from "lit";
import { dispatchCustomEvent } from "@/utils/dom-utils.ts";


export class BaseLitElement extends LitElement {

  public dispatchCustomEvent<T extends Record<string|number|symbol, any>>(eventName: string, detail?: T): void {
    dispatchCustomEvent<T>(this, eventName, detail);
  }

}

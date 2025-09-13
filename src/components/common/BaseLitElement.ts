import { LitElement } from "lit";


export class BaseLitElement extends LitElement {

  public dispatchCustomEvent(eventName: string, detail?: object): void {
    this.dispatchEvent(new CustomEvent(
      eventName,
      {
        bubbles: true,
        composed: true,
        detail
      }
    ));
  }

}

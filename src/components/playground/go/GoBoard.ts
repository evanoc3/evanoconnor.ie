import { css, html, LitElement, type CSSResultGroup, type TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { GoGameService } from "@/components/playground/go/GoGameService.ts";

declare global {
  interface HTMLElementTagNameMap {
    "eoc-goboard": GoBoardElement;
  }
}

@customElement("eoc-goboard")
export default class GoBoardElement extends LitElement {

  @property({ attribute: false }) public goGameService = new GoGameService();


  public static get styles(): CSSResultGroup {
    return css`
    `;
  }

  public render(): TemplateResult {
    return html`
      <div id="board">

      </div>
    `;
  }

}

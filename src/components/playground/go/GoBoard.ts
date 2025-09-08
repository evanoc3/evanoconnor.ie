import { css, html, LitElement, type CSSResultGroup, type TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import type { GoBoardDimensions } from "./Go.types";

declare global {
  interface HTMLElementTagNameMap {
    "eoc-goboard": GoBoardElement;
  }
}

@customElement("eoc-goboard")
export default class GoBoardElement extends LitElement {

  public static get styles(): CSSResultGroup {
    return css`
      :host {
        display: block;
        box-sizing: border-box;
      }

      div#container {
        display: grid;
        width: 100%;
        height: 100%;
        place-items: center;
        container-type: size;
      }

      div#board {
        aspect-ratio: 1 / 1;
        margin: 0 auto;
        width: min(100cqw, 100cqh);
        overflow: hidden;
      }

      svg {
        width: 100%;
        height: 100%;
      }
    `;
  }

  @property({ type: Object, attribute: "board-dimensions" }) public boardDimensions: GoBoardDimensions = { width: 19, height: 19 };

  public render(): TemplateResult {
    return html`
    <div id="container">
      <div id="board">
        <svg viewBox="">

        </svg>
      </div>
    </div>
    `;
  }

}

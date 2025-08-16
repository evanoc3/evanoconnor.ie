import { html, LitElement, css } from "lit";
import type { TemplateResult, CSSResult } from "lit";


export default class TableOfContents extends LitElement {

  public static get styles(): CSSResult {
    return css``;
  }

  public render(): TemplateResult {
    return html`
      <div>Table of Contents!!!</div>
    `;
  }

}

customElements.define("eoc-toc", TableOfContents);

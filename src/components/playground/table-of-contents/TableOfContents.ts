import { html, LitElement, css, nothing, type TemplateResult, type CSSResult, type PropertyValues } from "lit";
import { customElement, property, state } from "lit/decorators.js";


export interface TableOfContentsModelNode {
  headingType: number
  id?: string
  text: string
  children: TableOfContentsModelNode[]
  parent?: TableOfContentsModelNode
  depth: number
}

declare global {
  interface HTMLElementTagNameMap {
    "eoc-toc": TableOfContentsElement;
  }
}

@customElement("eoc-toc")
export default class TableOfContentsElement extends LitElement {

  @property({ type: String, attribute: "target-id" }) public targetId?: string;
  @property({ attribute: false }) public target?: HTMLElement;
  @property({ type: String, attribute: "table-title" }) public tableTitle?: string;
  @state() private model: TableOfContentsModelNode[] = [];
  private mutationObserver?: MutationObserver;

  // Lit lifecycle

  public static get styles(): CSSResult {
    return css`
      :host {
        display: block;
        height: auto;
      }

      strong {
        display: block;
        margin-bottom: 0.5rem;
      }

      ol {
        list-style: none;
        padding: 0;
        margin: 0;
      }

      ol.depth-1,
      ol.depth-2,
      ol.depth-3,
      ol.depth-4,
      ol.depth-5 {
        margin-left: 1.5rem;
      }

      li {
        margin-bottom: 0.2rem;
      }

      a {
        cursor: pointer;
        text-decoration: none;
        color: var(--link-colour, LinkText);

        &:visited {
          color: var(--link-visited-colour, VisitedText);
        }

        &:active {
          color: var(--link-active-colour, ActiveText);
        }
      }
    `;
  }

  public override render(): TemplateResult {
    return html`
      <div>
        ${ this.tableTitleTemplate }
        ${ this.tableTemplate }
      </div>
    `;
  }

  public override willUpdate(changedProperties: PropertyValues<this>) {
    if(changedProperties.has("targetId")) {
      this.onTargetIdChanged();
    }

    if(changedProperties.has("target")) {
      this.onTargetChanged();
    }

    super.willUpdate(changedProperties);
  }

  public override disconnectedCallback(): void {
    super.disconnectedCallback();

    if(this.mutationObserver) {
      this.mutationObserver.disconnect();
      this.mutationObserver = undefined;
    }
  }

  // Public API

  public updateModel(): void {
    this.model = buildTableOfContentsModel(this.target);
  }

  // Private Methods

  private get tableTitleTemplate(): TemplateResult | typeof nothing {
    return this.tableTitle
      ? html`<strong>${this.tableTitle}</strong>`
      : nothing;
  }

  private get tableTemplate(): TemplateResult | typeof nothing {
    return this.model.length
      ? html`<ol class="depth-0">${this.model.map((node) => this.renderModelNode(node))}</ol>`
      : nothing
  }
  
  private onTargetIdChanged(): void {
    if(!this.targetId) {
      this.target = undefined;
      return;
    }

    const newTarget = document.getElementById(this.targetId) ?? undefined;
    if(newTarget && newTarget !== this.target) {
      this.target = newTarget;
      this.onTargetChanged();
    }
  }

  private onTargetChanged(): void {
    if(!this.target) {
      return;
    }

    this.setupMutationObserver();

    this.updateModel();
  }

  private setupMutationObserver(): void {
    if(!this.target) {
      return;
    }

    if(this.mutationObserver) {
      this.mutationObserver.disconnect();
      this.mutationObserver = undefined;
    }

    this.mutationObserver = new MutationObserver(() => this.updateModel());
    this.mutationObserver.observe(this.target, {
      subtree: true,
      childList: true
    });

  }

  private renderModelNode(node: TableOfContentsModelNode): TemplateResult {
    return html`
      <li>
        ${
          node.id 
            ? html`<a href="#${node.id}" @click=${this.onLinkClicked}>${node.text}</a>`
            : html`<span>${node.text}</span>`
        }
        </li>

        ${
          node.children.length
            ? html`<ol class="${`depth-${node.depth + 1}`}">${node.children.map((node) => this.renderModelNode(node))}</ol>`
            : nothing
        }
    `;
  }

  private onLinkClicked(e: MouseEvent): void {
    e.preventDefault();

    const eventTarget = e.currentTarget as HTMLAnchorElement;
    const href = eventTarget.getAttribute("href") ?? "";
    const hashIndex = href.lastIndexOf("#");

    if(hashIndex === -1) {
      return;
    }

    const targetId = href.substring(hashIndex + 1);
    if (targetId) {
      const targetElement = document.getElementById(targetId);
      targetElement?.scrollIntoView({ behavior: "smooth" });
      history.replaceState(null, "", `#${targetId}`);
    }
  }
}


function buildTableOfContentsModel(target?: HTMLElement): TableOfContentsModelNode[] {
  const newModel: TableOfContentsModelNode[] = [];
  let cur: TableOfContentsModelNode | undefined;

  const headings = target?.querySelectorAll<HTMLHeadingElement>("h1, h2, h3, h4, h5, h6") ?? [];

  for(const heading of headings) {
    const newNode: TableOfContentsModelNode = {
      headingType: getHeadingType(heading),
      id: heading.id || undefined,
      text: heading.textContent,
      children: [],
      depth: -1
    };

    while(cur && newNode.headingType <= cur.headingType) {
      cur = cur.parent;
    }

    if(!cur) {
      newNode.depth = 0;
      newModel.push(newNode);
    } else {
      newNode.parent = cur;
      newNode.depth = cur.depth + 1;
      cur.children.push(newNode);
    }

    cur = newNode;
  }

  return newModel;
}

function getHeadingType(heading: HTMLHeadingElement): number {
  switch(heading.tagName.toLowerCase()) {
    case "h1":
      return 1;
    case "h2":
      return 2;
    case "h3":
      return 3;
    case "h4":
      return 4;
    case "h5":
      return 5;
    case "h6":
      return 6;
    default:
      return -1;
  }
}

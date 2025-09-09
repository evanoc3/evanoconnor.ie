import { css, html, LitElement, nothing, svg, type CSSResultGroup, type TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import type { GoBoardDimensions, GoPosition, GoStone } from "./Go.types.ts";


interface Coordinates {
  x: number;
  y: number;
}

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
  @property({ type: Array, attribute: "data-stones" }) public stones: GoStone[] = [];
  @property({ type: Boolean, attribute: "data-editable" }) public editable = false;

  public render(): TemplateResult {
    return html`
    <div id="container">
      <div id="board">
        <svg viewBox="0 0 280 280" xmlns="http://www.w3.org/2000/svg">
          ${ this.backgroundTemplate }
          ${ this.gridLinesTemplate }
          ${ this.starPointsTemplate }
          ${ this.stonesTemplate }
        </svg>
      </div>
    </div>
    `;
  }

  private get backgroundTemplate(): TemplateResult {
    return svg`
      <rect width="100%" height="100%" fill="#deb887" />
    `;
  }

  private get gridLinesTemplate(): TemplateResult {
    const lines: TemplateResult[] = [];

    // Vertical lines
    for (let x = 0; x < this.boardDimensions.width; x++) {
      const { x: x1, y: y1 } = this.mapBoardPositionToSvg({ x, y: 0 });
      const { x: x2, y: y2 } = this.mapBoardPositionToSvg({ x, y: this.boardDimensions.height - 1 });
      lines.push(svg`<line x1="${x1}" x2="${x2}" y1="${y1}" y2="${y2}" />`);
    }
    
    // Horizontal lines
    for (let y = 0; y < this.boardDimensions.height; y++) {
      const { x: x1, y: y1 } = this.mapBoardPositionToSvg({ x: 0, y });
      const { x: x2, y: y2 } = this.mapBoardPositionToSvg({ x: this.boardDimensions.width - 1, y });
      lines.push(svg`<line x1="${x1}" x2="${x2}" y1="${y1}" y2="${y2}" />`);
    }
    
    return svg`
      <g id="grid-lines" stroke="#000000" stroke-width="1" stroke-linecap="round">
        ${ lines }
      </g>
    `;
  }

  private get stonesTemplate(): TemplateResult | typeof nothing {
    const filteredStones = this.stones.filter(stone => {
      return stone.x >= 0 && stone.x < this.boardDimensions.width &&
             stone.y >= 0 && stone.y < this.boardDimensions.height &&
             ["black", "white"].includes(stone.colour);
    });

    if(!filteredStones.length) {
      return nothing;
    }

    const stoneTemplates = filteredStones.map(stone => {
      const { x, y } = this.mapBoardPositionToSvg(stone);
      return svg`<circle cx="${x}" cy="${y}" r="6" fill="${stone.colour}" />`;
    });

    return svg`
      <g id="stones" stroke="#000000" stroke-width="1" stroke-linecap="round">
        ${ stoneTemplates }
      </g>
    `;
  }

  private mapBoardPositionToSvg(pos: GoPosition): Coordinates {
    const widthStep = 280 / (this.boardDimensions.width + 1);
    const heightStep = 280 / (this.boardDimensions.height + 1);

    return {
      x: widthStep * (pos.x + 1),
      y: heightStep * (pos.y + 1)
    };
  }

  private get starPointsTemplate(): TemplateResult | typeof nothing {
    const { width: boardWidth, height: boardHeight } = this.boardDimensions;

    if(boardHeight === 19 && boardWidth === 19) {
      const starPositions: Coordinates[] = [
        { x: 3, y: 3  }, { x: 9, y: 3  }, { x: 15, y: 3 },
        { x: 3, y: 9  }, { x: 9, y: 9  }, { x: 15, y: 9 },
        { x: 3, y: 15 }, { x: 9, y: 15 }, { x: 15, y: 15 }
      ];
      const starTemplates = starPositions.map(pos => {
        const { x, y } = this.mapBoardPositionToSvg(pos);
        return svg`<circle cx="${x}" cy="${y}" r="2" fill="#333"/>`;
      });
      return svg`
        <g id="star-points" fill="#000000">
          ${ starTemplates }
        </g>
      `;
    }

    return nothing;
  }

}

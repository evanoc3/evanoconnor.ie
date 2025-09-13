import { css, html, LitElement, nothing, svg, type CSSResultGroup, type TemplateResult } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";
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


const svgViewBoxSize = 280;


@customElement("eoc-goboard")
export class GoBoardElement extends LitElement {

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
        stroke-width: 1;
        stroke-linecap: round;

        rect#background {
          width: 100%;
          height: 100%;
          fill: var(--go-board-background-colour, #deb887);
        }

        g#grid-lines {
          stroke: var(--go-board-line-colour, #000);
        }

        circle {
          &.white-stone {
            stroke: var(--go-board-white-stone-border-colour, #eee);
            fill: var(--go-board-white-stone-colour, #fff);
          }

          &.black-stone {
            stroke: var(--go-board-black-stone-border-colour, #111);
            fill: var(--go-board-black-stone-colour, #000);
          }
        }

        g#star-points {
          fill: var(--go-board-line-colour, #000);
        }

        circle#nearest-board-point-marker {
          fill: var(--highlighted-point-marker-colour, #ff00ff4d);
        }
      }
    `;
  }

  @property({ type: Object, attribute: "board-dimensions" }) public boardDimensions: GoBoardDimensions = { width: 19, height: 19 };
  @property({ type: Array, attribute: "data-stones" }) public stones: GoStone[] = [];
  @property({ type: Boolean, attribute: "data-editable" }) public editable = false;
  @state() private nearestBoardPoint?: Coordinates;
  @query("div#board") private boardElement!: HTMLDivElement;

  public render(): TemplateResult {
    return html`
    <div id="container">
      <div
        id="board"
        @mousemove=${this.onMouseMove}
        @mouseleave=${this.onMouseLeave}
        @click=${this.onClick}
      >
        <svg viewBox="0 0 ${svgViewBoxSize} ${svgViewBoxSize}" xmlns="http://www.w3.org/2000/svg">
          <rect id="background" />
          ${ this.gridLinesTemplate }
          ${ this.starPointsTemplate }
          ${ this.stonesTemplate }
          ${ this.nearestBoardPointMarkerTemplate }
        </svg>
      </div>
    </div>
    `;
  }

  private get gridLinesTemplate(): TemplateResult {
    const lines: TemplateResult[] = [];

    // Vertical lines
    for (let x = 0; x < this.boardDimensions.width; x++) {
      const { x: x1, y: y1 } = this.getSvgCoordsForBoardPosition({ x, y: 0 });
      const { x: x2, y: y2 } = this.getSvgCoordsForBoardPosition({ x, y: this.boardDimensions.height - 1 });
      lines.push(svg`<line x1="${x1}" x2="${x2}" y1="${y1}" y2="${y2}" />`);
    }
    
    // Horizontal lines
    for (let y = 0; y < this.boardDimensions.height; y++) {
      const { x: x1, y: y1 } = this.getSvgCoordsForBoardPosition({ x: 0, y });
      const { x: x2, y: y2 } = this.getSvgCoordsForBoardPosition({ x: this.boardDimensions.width - 1, y });
      lines.push(svg`<line x1="${x1}" x2="${x2}" y1="${y1}" y2="${y2}" />`);
    }
    
    return svg`
      <g id="grid-lines">
        ${ lines }
      </g>
    `;
  }

  private get stonesTemplate(): TemplateResult | typeof nothing {
    const filteredStones = this.stones.filter(stone => (
      stone.x >= 0 && stone.x < this.boardDimensions.width &&
      stone. y >= 0 && stone.y < this.boardDimensions.height &&
      ["black", "white"].includes(stone.colour)
    ));

    if(!filteredStones.length) {
      return nothing;
    }

    const stoneTemplates = filteredStones.map(stone => {
      const { x, y } = this.getSvgCoordsForBoardPosition(stone);
      return svg`<circle cx="${x}" cy="${y}" r="6" class="${stone.colour}-stone" />`;
    });

    return svg`
      <g id="stones">
        ${ stoneTemplates }
      </g>
    `;
  }

  private get starPointsTemplate(): TemplateResult | typeof nothing {
    const starPointPositions = this.starPointPositions;
    if(!starPointPositions.length) {
      return nothing;
    }

    const starTemplates = starPointPositions.map(pos => {
      const { x, y } = this.getSvgCoordsForBoardPosition(pos);
      return svg`<circle cx="${x}" cy="${y}" r="2" />`;
    });

    return svg`
      <g id="star-points">
        ${ starTemplates }
      </g>
    `;
  }

  private get starPointPositions(): Coordinates[] {
    const { width: boardWidth, height: boardHeight } = this.boardDimensions;

    if(boardHeight === 19 && boardWidth === 19) {
      return [
        { x: 3, y: 3  }, { x: 9, y: 3  }, { x: 15, y: 3 },
        { x: 3, y: 9  }, { x: 9, y: 9  }, { x: 15, y: 9 },
        { x: 3, y: 15 }, { x: 9, y: 15 }, { x: 15, y: 15 }
      ];
    }

    return [];
  }

  private get nearestBoardPointMarkerTemplate(): TemplateResult | typeof nothing {
    if(!this.nearestBoardPoint) {
      return nothing;
    }

    return svg`
      <circle id="nearest-board-point-marker" cx="${this.nearestBoardPoint.x}" cy="${this.nearestBoardPoint.y}" r="5" />
    `;
  }

  private onMouseMove(e: MouseEvent): void {
    if(!this.editable) return;

    const rect = this.boardElement.getBoundingClientRect();
    const svgCoords = this.mapPixelCoordsToSvgCoords({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    const nearestBoardPosition = this.getNearestBoardPoint(svgCoords);

    this.nearestBoardPoint = !this.hasStoneAt(nearestBoardPosition)
      ? this.getSvgCoordsForBoardPosition(nearestBoardPosition)
      : undefined;
  }

  private onMouseLeave(_e: MouseEvent): void {
    this.nearestBoardPoint = undefined;
  }

  private onClick(_e: MouseEvent): void {

  }

  private getSvgCoordsForBoardPosition(pos: GoPosition): Coordinates {
    const widthStep = svgViewBoxSize / (this.boardDimensions.width + 1);
    const heightStep = svgViewBoxSize / (this.boardDimensions.height + 1);

    return {
      x: widthStep * (pos.x + 1),
      y: heightStep * (pos.y + 1)
    };
  }

  private mapPixelCoordsToSvgCoords(pxCoords: Coordinates): Coordinates {
    const boardElRect = this.boardElement.getBoundingClientRect();

    return {
      x: (pxCoords.x / boardElRect.width) * svgViewBoxSize,
      y: (pxCoords.y / boardElRect.height) * svgViewBoxSize
    };
  }

  private getNearestBoardPoint(svgCoords: Coordinates): GoPosition {
    let nearestPosition: GoPosition | undefined;
    let nearestPositionDistance: number | undefined;

    for(let x = 0; x < this.boardDimensions.width; x++) {
      for(let y = 0; y < this.boardDimensions.height; y++) {

        const { x: svgX, y: svgY } = this.getSvgCoordsForBoardPosition({ x, y });
        const distance = Math.hypot(svgX - svgCoords.x, svgY - svgCoords.y);
        
        if(!nearestPositionDistance || distance < nearestPositionDistance) {
          nearestPositionDistance = distance;
          nearestPosition = { x, y };
        }

      }
    }

    return nearestPosition!;
  }

  private hasStoneAt(pos: GoPosition): boolean {
    return this.stones.some(stone => stone.x === pos.x && stone.y === pos.y);
  }

}

export default GoBoardElement;

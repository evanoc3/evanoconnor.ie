import { v7 as uuidV7 } from "uuid";
import type { GoBoardSize, GoTurn, GoBoardDimensions, GoStoneColour, GoPosition, GoStone } from "./Go.types.ts";
import { TypedEventEmitter } from "./TypedEventEmitter.ts";


export type GoGameConstructorParameters = Partial<{
  id: string
  createdAt: Date
  boardSize: GoBoardSize
} & ({
  turns: GoTurn[]
  stones: never
} | {
  turns: never
  stones: GoStone[]
})>


type GoGameEventMap = {
};


export class GoGame extends TypedEventEmitter<GoGameEventMap> {
  public readonly id: string;
  public readonly createdAt: Date;
  public readonly boardDimensions: GoBoardDimensions;
  public readonly turns: GoTurn[];
  private readonly _stones = new Map<string, GoStone>();

  // Public API

  constructor(args?: GoGameConstructorParameters) {
    super();

    this.id = args?.id ?? uuidV7();
    this.createdAt = args?.createdAt ?? new Date();
    this.boardDimensions = {
      width: args?.boardSize ?? 19,
      height: args?.boardSize ?? 19
    };
    this.turns = args?.turns ?? [];

    if(args?.stones?.length) {
      this.applyStones(args.stones);
    }
  }

  public get nextTurnPlayer(): GoStoneColour {
    const lastTurn = this.turns.at(-1);
    if(!lastTurn) {
      return "black";
    }
    return lastTurn.player === "black"
      ? "white"
      : "black";
  }

  public getStoneAt(pos: GoPosition): GoStone | undefined {
    const mapKey = getMapKeyForPosition(pos);
    const stone = this._stones.get(mapKey);
    return stone;
  }

  public get stones(): GoStone[] {
    return Array.from(
      this._stones.values()
    );
  }

  // Private Methods

  private applyStones(stones: GoStone[]): void {
    for(const stone of stones) {
      const pos: GoPosition = stone;
      if(!this.getStoneAt(pos)) {
        const mapKey = getMapKeyForPosition(pos);
        this._stones.set(mapKey, stone);
      }
    }
  }

}


function getMapKeyForPosition(pos: GoPosition): string {
  return `${pos.x},${pos.y}`;
}

import { randomUUID } from "node:crypto";
import type { GoBoardSize, GoTurn, GoBoardDimensions, GoStoneColour, GoPosition, GoStone } from "./Go.types.ts";


type GoGameConstructorParameters  = Partial<{
  id: string
  createdAt: Date
  boardSize: GoBoardSize
  turns: GoTurn[]
}>


export class GoGame {
  public readonly id: string;
  public readonly createdAt: Date;
  public readonly boardDimensions: GoBoardDimensions;
  public readonly turns: GoTurn[];
  private stones = new Map<string, GoStone>();

  constructor(args?: GoGameConstructorParameters) {
    const id = args?.id ?? randomUUID();
    const createdAt = args?.createdAt ?? new Date();
    const boardSize = args?.boardSize ?? 19;
    const turns = args?.turns ?? [];

    this.id = id;
    this.createdAt = createdAt;
    this.boardDimensions = {
      width: boardSize,
      height: boardSize
    };
    this.turns = turns;
  }

  public get nextTurnPlayer(): GoStoneColour {
    const lastTurn = this.turns.at(-1);
    if(!lastTurn) {
      return "black";
    }
    return lastTurn.player === "black" ? "white" : "black";
  }

  public getStoneAt(pos: GoPosition): GoStone | undefined {
    const mapKey = `${pos.x},${pos.y}`;
    const stone = this.stones.get(mapKey);
    return stone;
  }
}

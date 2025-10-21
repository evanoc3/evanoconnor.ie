export type GoBoardSize = 9 | 13 | 19;

export interface GoBoardDimensions {
  width: GoBoardSize
  height: GoBoardSize
}

export type GoStoneColour = "white" | "black";

export interface GoPosition {
  x: number
  y: number
}

export interface GoStone extends GoPosition {
  colour: GoStoneColour
}

export interface GoTurn {
  colour: GoStoneColour
  createdAt: Date
  placedStone: GoStone
  removedStones: GoStone[]
}

export type GoGameState = "inProgress" | "ended";

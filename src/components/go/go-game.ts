import { v7 as uuidV7 } from "uuid";

import type { GoBoardDimensions, GoBoardSize, GoGameState, GoPosition, GoStone, GoStoneColour, GoTurn } from "#/types/go-types.ts";
import { TypedEventEmitter } from "./typed-event-emitter.ts";


export type GoGameConstructorParameters = Partial<{
  id: string
  createdAt: Date
  boardSize: GoBoardSize
  state: GoGameState
} & ({
  turns: GoTurn[]
  stones: never
} | {
  turns: never
  stones: GoStone[]
})>

type GoGamePlaceStoneReturnType = {
  success: false,
  errorMessage: string,
  removedStones?: never
} | {
  success: true,
  errorMessage?: never,
  removedStones: GoStone[]
};


export type GoGameEventMap = {
  "new-turn-made": { turn: GoTurn }
  "game-state-changed": { gameState: GoGameState }
};


interface GoStoneGroup {
  colour: GoStoneColour,
  stones: GoStone[]
}


export class GoGame extends TypedEventEmitter<GoGameEventMap> {
  public readonly id: string;
  public readonly createdAt: Date;
  public readonly boardDimensions: GoBoardDimensions;
  public readonly turns: GoTurn[];
  private _state: GoGameState;
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
    this._state = args?.state ?? "inProgress";

    if(args?.stones?.length) {
      this.applyStones(args.stones);
    }
  }

  public get nextTurnColour(): GoStoneColour {
    const lastTurn = this.turns.at(-1);
    if(!lastTurn) {
      return "black";
    }
    return lastTurn.colour === "black"
      ? "white"
      : "black";
  }

  public getStoneAt(pos: GoPosition, allStones = this.stones): GoStone | undefined {
    return allStones.find(stone => positionsAreEqual(stone, pos));
  }

  public get stones(): GoStone[] {
    return Array.from( this._stones.values() );
  }

  /**
   * @fires new-turn-made
   */
  public newTurn(placedStone: GoStone): void {
    const { success, errorMessage, removedStones } = this.placeStone(placedStone);
    if(!success) {
      console.error("Failed to make move:", errorMessage);
      return;
    }

    const newTurn: GoTurn = {
      colour: placedStone.colour,
      createdAt: new Date(),
      placedStone,
      removedStones
    };

    this.turns.push(newTurn);

    this.dispatchCustomEvent("new-turn-made", { turn: newTurn });
  }

  public get state(): GoGameState {
    return this._state;
  }

  public end(): void {
    this._state = "ended";
    this.dispatchCustomEvent("game-state-changed", { gameState: this.state });
  }

  // Private Methods

  private applyStones(stones: GoStone[]): void {
    for(const stone of stones) {
      const pos: GoPosition = stone;
      if(this.isPositionWithinBounds(pos)) {
        this._stones.set(getMapKeyForPosition(stone), stone);
      }
    }
  }

  private isPositionWithinBounds(pos: GoPosition): boolean {
    return (
      pos.x >= 0 && pos.x < this.boardDimensions.width &&
      pos.y >= 0 && pos.y < this.boardDimensions.height
    );
  }

  private placeStone(placedStone: GoStone): GoGamePlaceStoneReturnType {
    if(this.state !== "inProgress") {
      return {
        success: false,
        errorMessage: "game is ended"
      };
    }
    
    if(placedStone.colour !== this.nextTurnColour) {
      return {
        success: false,
        errorMessage: `unexpected stone colour: ${placedStone.colour}, expected ${this.nextTurnColour}`
      };
    }

    const pos: GoPosition = placedStone;
    if(!this.isPositionWithinBounds(pos)) {
      return {
        success: false,
        errorMessage: `unexpected position: (${pos.x},${pos.y})`
      };
    }

    if(this.getStoneAt(pos)) {
      return {
        success: false,
        errorMessage: `stone already exists at position: (${pos.x},${pos.y})`
      };
    }

    this._stones.set(getMapKeyForPosition(pos), placedStone);

    const deadOtherColourStoneGroups = this.getStoneGroups(this.stones).filter(group => (
			group.colour !== placedStone.colour &&
      this.getLiberties(group) === 0
    ));

		const removedStones = deadOtherColourStoneGroups.map(group => group.stones).flat();

    if(this.checkForSuicide(placedStone.colour, removedStones)) {
			this.removeStones(placedStone);
			return {
        success: false,
        errorMessage: "suicide"
      };
		}

    if(this.checkForKo(placedStone)) {
      this.removeStones(placedStone);
      return {
        success: false,
        errorMessage: "ko"
      };
    }

    this.removeStones(removedStones);
    
    return {
      success: true,
      removedStones
    };
  }

  private getAdjacentPositions(stoneGroup: GoStoneGroup): GoPosition[] {
    let groupAdjacentPositions: GoPosition[] = [];
  
    for(const groupStone of stoneGroup.stones) {
      let stoneAdjacentPositions: GoPosition[] = [];
  
      if(groupStone.x > 0) {
        stoneAdjacentPositions.push({ x: groupStone.x - 1, y: groupStone.y });
      }
      if(groupStone.x < this.boardDimensions.width - 1) {
        stoneAdjacentPositions.push({ x: groupStone.x + 1, y: groupStone.y });
      }
      if(groupStone.y > 0) {
        stoneAdjacentPositions.push({ x: groupStone.x, y: groupStone.y - 1 });
      }
      if (groupStone.y < this.boardDimensions.height - 1) {
        stoneAdjacentPositions.push({ x: groupStone.x, y: groupStone.y + 1 });
      }
  
      stoneAdjacentPositions = stoneAdjacentPositions.filter(stoneAdjacentPosition => !stoneGroup.stones.some(otherGroupStone => positionsAreEqual(otherGroupStone, stoneAdjacentPosition)));
      groupAdjacentPositions = [...groupAdjacentPositions, ...stoneAdjacentPositions];
    }
  
    return groupAdjacentPositions;
  }

  private getLiberties(stoneGroup: GoStoneGroup, allStones = this.stones): number {
    return this.getAdjacentPositions(stoneGroup).filter(adjacentPosition => !this.getStoneAt(adjacentPosition, allStones)).length;
  }

  private checkForSuicide(colour: GoStoneColour, removedStones: GoStone[]): boolean {
		const stones = structuredClone(this.stones).filter(stone => !positionsInclude(removedStones, stone));

		const sameColourStoneGroups = this.getStoneGroups(stones).filter(group => group.colour === colour);
		const suicideStoneGroups = sameColourStoneGroups.filter(group => this.getLiberties(group, stones) === 0);
		return suicideStoneGroups.length > 0;
	}

  private getStoneGroups(allStones = this.stones): GoStoneGroup[] {
    const groups: GoStoneGroup[] = [];
  
    const ungroupedStones = structuredClone(allStones);
  
    while(ungroupedStones.length) {
      const firstStone = ungroupedStones.shift()!;
  
      const group: GoStoneGroup = {
        colour: firstStone.colour,
        stones: [firstStone]
      };
  
      let foundAdjacentStone: boolean;
      do {
        foundAdjacentStone = false;
        const adjacentPositions = this.getAdjacentPositions(group);
        
        const adjacentStones = ungroupedStones.filter(ungroupedStone => (
          ungroupedStone.colour === group.colour &&
          positionsInclude(adjacentPositions, ungroupedStone)
        ));
  
        if(adjacentStones.length) {
          foundAdjacentStone = true;
  
          group.stones = [...group.stones, ...adjacentStones];
  
          for(const adjacentStone of adjacentStones) {
            const i = ungroupedStones.indexOf(adjacentStone);
            ungroupedStones.splice(i, 1);
          }
        }
      } while(ungroupedStones.length && foundAdjacentStone);
  
      groups.push(group);
    }
  
    return groups;
  }

  private removeStones(stones: GoStone | GoStone[]): void {
    const stonesToRemove = Array.isArray(stones) ? stones : [stones];
    for(const stone of stonesToRemove) {
      const mapKey = getMapKeyForPosition(stone);
      this._stones.delete(mapKey);
    }
  }

  private checkForKo(placedStone: GoStone): boolean {
    const latestTurn = this.turns.at(-1);
		if(!latestTurn) {
			return false;
		}

		if(latestTurn.removedStones.length !== 1) {
			return false;
		}

		const removedStone = latestTurn.removedStones[0];
		return (
      placedStone.colour === removedStone.colour &&
      placedStone.x      === removedStone.x &&
      placedStone.y      === removedStone.y
    );
	}

}


function getMapKeyForPosition(pos: GoPosition): string {
  return `${pos.x},${pos.y}`;
}

function positionsAreEqual(posA: GoPosition, posB: GoPosition): boolean {
  return posA.x === posB.x && posA.y === posB.y;
}

function positionsInclude(positions: GoPosition[], searchPos: GoPosition): boolean {
  return positions.some(p => positionsAreEqual(p, searchPos));
}

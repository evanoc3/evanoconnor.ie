import { GoGameServiceEventEmitter } from "./GoGameServiceEventEmitter.ts";
import { GoGame } from "./GoGame.ts";


export class GoGameService extends GoGameServiceEventEmitter {
  private readonly games: Map<string, GoGame> = new Map();
  private _capacity = 1;

  // Public API

  public get capacity(): number {
    return this._capacity;
  }

  public set capacity(newValue: number) {
    if(newValue < 1) {
      return;
    }

    this._capacity = newValue;

    if(this.games.size > this._capacity) {
      const gameKeys = Array.from(this.games.keys());
      for(let i = this.capacity; i < gameKeys.length - 1; i++) {
        const gameKey = gameKeys[i];
        this.games.delete(gameKey);
      }
    }
  }

  public newGame(): GoGame {
    const game = new GoGame();

    this.games.set(game.id, game);
    this.dispatchEvent("gameCreated", { gameId: game.id });
    return game;
  }

  public getGame(id: string): GoGame | undefined {
    return this.games.get(id);
  }

}

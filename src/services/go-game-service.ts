import { GoGame, type GoGameConstructorParameters } from "#/components/go/go-game.ts";
import { LruCache } from "#/components/go/lru-cache.ts";
import { TypedEventEmitter } from "#/components/go/typed-event-emitter.ts";


type GoGameServiceEventMap = {
  "new-game-created": { gameId: string }
};


export class GoGameService extends TypedEventEmitter<GoGameServiceEventMap> {
  private readonly gamesCache = new LruCache<GoGame>(1);

  // Public API

  public newGame(args?: GoGameConstructorParameters): GoGame {
    const game = new GoGame(args);

    this.gamesCache.set(game.id, game);
    this.dispatchCustomEvent("new-game-created", { gameId: game.id });
    return game;
  }

  public getGame(id: string): GoGame | undefined {
    return this.gamesCache.get(id);
  }

}

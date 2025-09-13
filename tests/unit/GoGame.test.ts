import { describe, it, expect, vi } from "vitest";
import { nextEventLoop } from "../unit-test-utils.ts";
import { GoGame } from "@/components/playground/go/GoGame.ts";

describe("GoGame", () => {

  it("should start blank", () => {
    const goGame = new GoGame();
    expect(goGame.boardDimensions).toEqual({ width: 19, height: 19 });
    expect(goGame.turns).toEqual([]);
    expect(goGame.stones).toEqual([]);
  });

  it("should respect initial configuration", () => {
    const goGame = new GoGame({
      boardSize: 9,
      stones: [
        { x: 0, y: 0, colour: "black" },
        { x: 1, y: 1, colour: "white" },
        { x: 2, y: 2, colour: "black" },
      ]
    });
    expect(goGame.boardDimensions).toEqual({ width: 9, height: 9 });
    expect(goGame.turns).toEqual([]);
    expect(goGame.stones).toEqual([
      { x: 0, y: 0, colour: "black" },
      { x: 1, y: 1, colour: "white" },
      { x: 2, y: 2, colour: "black" },
    ]);
  });

  it("should alternate nextTurnColour", () => {
    const goGame = new GoGame();
    expect(goGame.nextTurnColour).toBe("black");
    goGame.newTurn({ x: 0, y: 0, colour: "black" });
    expect(goGame.nextTurnColour).toBe("white");
    goGame.newTurn({ x: 1, y: 1, colour: "white" });
    expect(goGame.nextTurnColour).toBe("black");
  });

  it("should reflect placed stones in the stones property", () => {
    const goGame = new GoGame();
    goGame.newTurn({ x: 0, y: 0, colour: "black" });
    expect(goGame.stones).toEqual([
      { x: 0, y: 0, colour: "black" },
    ]);
    goGame.newTurn({ x: 1, y: 1, colour: "white" });
    expect(goGame.stones).toEqual([
      { x: 0, y: 0, colour: "black" },
      { x: 1, y: 1, colour: "white" },
    ]);
  });

  it("should reflect each new turn in the turns property", () => {
    const goGame = new GoGame();

    goGame.newTurn({ x: 0, y: 0, colour: "black" });
    expect(goGame.turns).toHaveLength(1);
    expect(goGame.turns[0]).toEqual({
      createdAt: expect.any(Date),
      colour: "black",
      placedStone: { x: 0, y: 0, colour: "black" },
      removedStones: [],
    });


    goGame.newTurn({ x: 1, y: 1, colour: "white" });
    expect(goGame.turns).toHaveLength(2);
    expect(goGame.turns[1]).toEqual({
      createdAt: expect.any(Date),
      colour: "white",
      placedStone: { x: 1, y: 1, colour: "white" },
      removedStones: [],
    });
  });

  it("should emit a 'new-turn-made' event when a valid new turn is made", async () => {
    const goGame = new GoGame();
    const eventListener = vi.fn();
    goGame.addEventListener("new-turn-made", eventListener);
    goGame.newTurn({ x: 0, y: 0, colour: "black" });

    await nextEventLoop();
    expect(eventListener).toHaveBeenCalledWith({
      type: "new-turn-made",
      details: {
        turn: {
          createdAt: expect.any(Date),
          colour: "black",
          placedStone: { x: 0, y: 0, colour: "black" },
          removedStones: [],
        }
      }
    });
  });

  it("shouldn't allow placing a stone with an out-of-bounds position", async () => {
    const goGame = new GoGame();
    const eventListener = vi.fn();
    goGame.addEventListener("new-turn-made", eventListener);
    goGame.newTurn({ x: 19, y: 19, colour: "black" });

    await nextEventLoop();
    expect(eventListener).not.toHaveBeenCalled();
    expect(goGame.stones).not.toContainEqual({ x: 19, y: 19, colour: "black" });
  });

  it("shouldn't allow placing a stone on an already occupied position", async () => {
    const goGame = new GoGame();
    const eventListener = vi.fn();
    goGame.addEventListener("new-turn-made", eventListener);
    goGame.newTurn({ x: 0, y: 0, colour: "black" });
    await nextEventLoop();
    eventListener.mockClear()

    goGame.newTurn({ x: 0, y: 0, colour: "white" });
    await nextEventLoop();
    expect(eventListener).not.toHaveBeenCalled();
    expect(goGame.stones).not.toContainEqual({ x: 0, y: 0, colour: "white" });
  });

  it("shouldn't allow a turn with an unexpected colour", async () => {
    const goGame = new GoGame();
    const eventListener = vi.fn();
    goGame.addEventListener("new-turn-made", eventListener);
    goGame.newTurn({ x: 0, y: 0, colour: "white" });

    await nextEventLoop();
    expect(eventListener).not.toHaveBeenCalled();
    expect(goGame.stones).not.toContainEqual({ x: 0, y: 0, colour: "white" });
  });

  it("shouldn't allow a turn which causes suicide", async () => {
    const goGame = new GoGame({
      stones: [
        { x: 1, y: 0, colour: "white" },
        { x: 2, y: 1, colour: "white" },
        { x: 1, y: 2, colour: "white" },
        { x: 0, y: 1, colour: "white" },
      ]
    });

    const eventListener = vi.fn();
    goGame.addEventListener("new-turn-made", eventListener);
    goGame.newTurn({ x: 1, y: 1, colour: "black" });

    await nextEventLoop();
    expect(goGame.stones).not.toContainEqual({ x: 1, y: 1, colour: "black" });
    expect(eventListener).not.toHaveBeenCalled();
  });

  it("shouldn't allow a turn which causes ko", async () => {
    const goGame = new GoGame();
    goGame.newTurn({ x: 1, y: 0, colour: "black" });
    goGame.newTurn({ x: 2, y: 0, colour: "white" });
    goGame.newTurn({ x: 0, y: 1, colour: "black" });
    goGame.newTurn({ x: 3, y: 1, colour: "white" });
    goGame.newTurn({ x: 1, y: 2, colour: "black" });
    goGame.newTurn({ x: 2, y: 2, colour: "white" });
    goGame.newTurn({ x: 2, y: 1, colour: "black" });
    
    const eventListener = vi.fn();
    goGame.addEventListener("new-turn-made", eventListener);
    await nextEventLoop();
    eventListener.mockClear();

    goGame.newTurn({ x: 2, y: 1, colour: "white" });
    await nextEventLoop();
    expect(eventListener).not.toHaveBeenCalled();
    expect(goGame.stones).not.toContainEqual({ x: 2, y: 1, colour: "white" });

  });

});

import { StrictMode, useRef, useState, type JSX } from "react";

import "./go-playground.scss";

import { GoGameService } from "@/services/go-game-service.ts";
import type { GoPosition } from "@/types/go-types.ts";
import GoBoard from "./go-board.tsx";


export default function GoPlaygroundWrapper(): JSX.Element {
  return (
    <StrictMode>
      <GoPlayground />
    </StrictMode>
  );
}


function GoPlayground(): JSX.Element {
  const goGameService = useRef(new GoGameService());
  const goGame = useRef(goGameService.current.newGame());

  const [boardDimensions, setBoardDimensions] = useState(goGame.current.boardDimensions);
  const [stones, setStones] = useState(goGame.current.stones);
  const [gameState, setGameState] = useState(goGame.current.state);
  const [nextTurnColour, setNextTurnColour] = useState(goGame.current.nextTurnColour);

  function updateGameState(): void {
    setBoardDimensions(goGame.current.boardDimensions);
    setStones(goGame.current.stones);
    setGameState(goGame.current.state);
    setNextTurnColour(goGame.current.nextTurnColour);
  }

  function onStonePlaced(pos: GoPosition): void {
    goGame.current.newTurn({ ...pos, colour: nextTurnColour });
    updateGameState();
  }

  function onNewGameClicked(): void {
    goGame.current = goGameService.current.newGame();
    updateGameState();
  }

  function onForfeitClicked(): void {
    goGame.current.end();
    updateGameState();
  }

  return (
    <div id="go-playground">
      <div id="play-area">
        <GoBoard
          boardDimensions={boardDimensions}
          stones={stones}
          editable={gameState === "inProgress"}
          onStonePlaced={onStonePlaced}
        />
      </div>

      <div id="sidebar">
        <div id="next-player-label">
          Next turn: { nextTurnColour }
        </div>

        <div id="buttons-row">
          <button onClick={onNewGameClicked}>New game</button>
          <button disabled={gameState === "ended"} onClick={onForfeitClicked}>Forfeit</button>
        </div>
      </div>
    </div>
  );
}

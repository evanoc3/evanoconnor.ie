import type { JSX, MouseEvent } from "react";
import { useEffect, useRef, useState } from "react";
import type { GoPosition, GoBoardDimensions, GoStone } from "./Go.types.ts";
import "./GoBoard.scss";


export interface Props {
  boardDimensions: GoBoardDimensions;
  stones?: GoStone[];
  editable?: boolean;
  onStonePlaced?: (pos: GoPosition) => void;
}


const svgViewBoxSize = 280;


export default function GoBoard(props: Props): JSX.Element {
  const [hoveredPosition, setHoveredPosition] = useState<GoPosition | undefined>(undefined);
  const boardElement = useRef<HTMLDivElement | null>(null);

  function onMouseMove(e: MouseEvent): void {
    if(!props.editable) {
      return;
    }

    const svgCoords = mapPixelCoordsToSvgCoords(boardElement.current!, { x: e.clientX, y: e.clientY });
    const nearestBoardPosition = getNearestBoardPosition(props.boardDimensions, svgCoords);

    const stoneExistsAtPosition = props.stones && hasStoneAt(props.stones, nearestBoardPosition);

    setHoveredPosition(!stoneExistsAtPosition
      ? nearestBoardPosition
      : undefined);
  }

  function onMouseLeave(_e: MouseEvent): void {
    setHoveredPosition(undefined);
  }

  function onClick(_e: MouseEvent): void {
    if(!props.editable || !hoveredPosition) {
      return;
    }

    props.onStonePlaced?.(hoveredPosition);
  }

  function onStonesChanged(): void {
    if(hoveredPosition && props.stones && hasStoneAt(props.stones, hoveredPosition)) {
      setHoveredPosition(undefined);
    }
  }

  useEffect(onStonesChanged, [ props.stones ]);

  return (
    <div className="go-board__container">
      <div
        className="go-board"
        ref={boardElement}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        onClick={onClick}
      >
        <svg viewBox={`0 0 ${svgViewBoxSize} ${svgViewBoxSize}`} xmlns="http://www.w3.org/2000/svg">
          <rect className="go-board__background" />
          { renderGridLines(props.boardDimensions) }
          { renderStarPoints(props.boardDimensions) }
          { renderStones(props.boardDimensions, props.stones) }
          { renderHoveredPositionMarker(props.boardDimensions, hoveredPosition) }
        </svg>
      </div>
    </div>
  );
}

function getSvgCoordsForBoardPosition(boardDimensions: GoBoardDimensions, pos: GoPosition): GoPosition {
  const widthStep = svgViewBoxSize / (boardDimensions.width + 1);
  const heightStep = svgViewBoxSize / (boardDimensions.height + 1);

  return {
    x: widthStep * (pos.x + 1),
    y: heightStep * (pos.y + 1)
  };
}

function renderGridLines(boardDimensions: GoBoardDimensions): JSX.Element {
  const renderedLines: JSX.Element[] = [];

  // Vertical lines
  for (let x = 0; x < boardDimensions.width; x++) {
    const { x: x1, y: y1 } = getSvgCoordsForBoardPosition(boardDimensions, { x, y: 0 });
    const { x: x2, y: y2 } = getSvgCoordsForBoardPosition(boardDimensions, { x, y: boardDimensions.height - 1 });
    const renderKey = `<line x1=${x1} x2=${x2} y1=${y1} y2=${y2} />`;
    renderedLines.push(
      <line key={renderKey} x1={x1} x2={x2} y1={y1} y2={y2} />
    );
  }
  
  // Horizontal lines
  for (let y = 0; y < boardDimensions.height; y++) {
    const { x: x1, y: y1 } = getSvgCoordsForBoardPosition(boardDimensions, { x: 0, y });
    const { x: x2, y: y2 } = getSvgCoordsForBoardPosition(boardDimensions, { x: boardDimensions.width - 1, y });
    const renderKey = `<line x1=${x1} x2=${x2} y1=${y1} y2=${y2} />`;
    renderedLines.push(
      <line key={renderKey} x1={x1} x2={x2} y1={y1} y2={y2} />
    );
  }
  
  return (
    <g className="go-board__grid-lines">
      { renderedLines }
    </g>
  );
}

function renderStarPoints(boardDimensions: GoBoardDimensions): JSX.Element | null {
  const starPointPositions = getStarPointPositions(boardDimensions);
  if(!starPointPositions.length) {
    return null;
  }

  const renderedStars = starPointPositions.map(pos => {
    const { x, y } = getSvgCoordsForBoardPosition(boardDimensions, pos);
    const renderkey = `<circle cx=${x} cy=${y} r=2 />`
    return (
      <circle key={renderkey} cx={x} cy={y} r={2} />
    );
  });

  return (
    <g className="star-points">
      { renderedStars }
    </g>
  );
}

function getStarPointPositions(boardDimensions: GoBoardDimensions): GoPosition[] {
  const boardWidth = boardDimensions.width;
  const boardHeight = boardDimensions.height;

  if(boardHeight === 19 && boardWidth === 19) {
    return [
      { x: 3, y: 3  }, { x: 9, y: 3  }, { x: 15, y: 3 },
      { x: 3, y: 9  }, { x: 9, y: 9  }, { x: 15, y: 9 },
      { x: 3, y: 15 }, { x: 9, y: 15 }, { x: 15, y: 15 }
    ];
  }

  return [];
}

function renderStones(boardDimensions: GoBoardDimensions, stones?: GoStone[]): JSX.Element | null {
  const filteredStones = (stones ?? []).filter(stone => (
    stone.x >= 0 && stone.x < boardDimensions.width &&
    stone. y >= 0 && stone.y < boardDimensions.height &&
    ["black", "white"].includes(stone.colour)
  ));

  if(!filteredStones.length) {
    return null;
  }

  const renderStones = filteredStones.map(stone => {
    const { x, y } = getSvgCoordsForBoardPosition(boardDimensions, stone);
    const renderKey = `<circle cx=${x} cy=${y} r=6 className="${stone.colour}-stone" />`;
    return (
      <circle key={renderKey} cx={x} cy={y} r={6} className={`${stone.colour}-stone`} />
    );
  });

  return (
    <g className="stones">
      { renderStones }
    </g>
  );
}

function renderHoveredPositionMarker(boardDimensions: GoBoardDimensions, hoveredPosition?: GoPosition): JSX.Element | null {
  if(!hoveredPosition) {
    return null;
  }

  const { x, y } = getSvgCoordsForBoardPosition(boardDimensions, hoveredPosition);
  const renderKey = `<circle cx=${x} cy=${y} r=5 />`;
  return (
    <circle key={renderKey} className="nearest-board-point-marker" cx={x} cy={y} r="5" />
  );
}

function hasStoneAt(allStones: GoStone[], pos: GoPosition): boolean {
  return allStones.some(stone => (
    stone.x === pos.x &&
    stone.y === pos.y
  ));
}

function mapPixelCoordsToSvgCoords(boardEl: HTMLDivElement, pxCoords: GoPosition): GoPosition {
  const boardElRect = boardEl.getBoundingClientRect();

  return {
    x: ((pxCoords.x - boardElRect.left) / boardElRect.width) * svgViewBoxSize,
    y: ((pxCoords.y - boardElRect.top) / boardElRect.height) * svgViewBoxSize
  };
}

function getNearestBoardPosition(boardDimensions: GoBoardDimensions, svgCoords: GoPosition): GoPosition {
  let nearestPosition: GoPosition | undefined;
  let nearestPositionDistance: number | undefined;

  for(let x = 0; x < boardDimensions.width; x++) {
    for(let y = 0; y < boardDimensions.height; y++) {

      const { x: svgX, y: svgY } = getSvgCoordsForBoardPosition(boardDimensions, { x, y });
      const distance = Math.hypot(svgX - svgCoords.x, svgY - svgCoords.y);
      
      if(!nearestPositionDistance || distance < nearestPositionDistance) {
        nearestPositionDistance = distance;
        nearestPosition = { x, y };
      }

    }
  }

  return nearestPosition!;
}

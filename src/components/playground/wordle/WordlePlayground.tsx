import { StrictMode, type JSX } from "react";
import "./WordlePlayground.scss";


const statsIconTemplate = (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="feather feather-bar-chart-2">
    <line x1="18" y1="20" x2="18" y2="10"></line>
    <line x1="12" y1="20" x2="12" y2="4"></line>
    <line x1="6" y1="20" x2="6" y2="14"></line>
  </svg>
);


const moreIconTemplate = (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="feather feather-more-horizontal">
    <circle cx="12" cy="12" r="1"></circle>
    <circle cx="19" cy="12" r="1"></circle>
    <circle cx="5" cy="12" r="1"></circle>
  </svg>
);


export default function WordlePlaygroundWrapper(): JSX.Element {
  return (
    <StrictMode>
      <WordlePlayground />
    </StrictMode>
  );
}

function WordlePlayground(): JSX.Element {
  function onMoreButtonClicked(): void {}
  function onStatsButtonClicked(): void {}

  return (
    <div id="wordle-playground">
      <div id="page-layout">
        <header>
          <slot name="go-back-container"></slot>

          <h1>Wordle</h1>

          <button id="stats-btn" onClick={onStatsButtonClicked} title="Open 'stats' popup">
            {statsIconTemplate}
          </button>

          <button onClick={onMoreButtonClicked} title="Open 'more' menu">
            {moreIconTemplate}
          </button>
        </header>
      </div>
    </div>
  );
}
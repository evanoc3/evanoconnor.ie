import type { JSX } from "react";

import BarChartSvg from "feather-icons/dist/icons/bar-chart-2.svg?react";
import MoreHorizontalSvg from "feather-icons/dist/icons/more-horizontal.svg?react";
import "./header.scss";


type Props = Readonly<{
  onStatsButtonClicked(): void;
  onMoreButtonClicked(): void;
}>;


export function Header(props: Props): JSX.Element {
  return (
    <header>
      <slot name="go-back-container"></slot>

      <h1>Wordle</h1>

      <button id="stats-btn" onClick={props.onStatsButtonClicked} title="Open 'stats' popup">
        <BarChartSvg />
      </button>

      <button onClick={props.onMoreButtonClicked} title="Open 'more' menu">
        <MoreHorizontalSvg />
      </button>
    </header>
  );
}

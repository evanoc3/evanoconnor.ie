import type { JSX } from "react";

import "./stats-popup.scss";

import wordleGameService from "#/services/wordle-game-service.ts";
import { PopupBase, SolutionDistributionGraph, useAppState } from "./index.ts";


type Props = Readonly<{
  close(): void
}>;


export function StatsPopup(props: Props): JSX.Element {
  const data = useAppState();

  function getNumberOfDaysPlayed(): number {
		if(!data) {
			return -1;
		}

		const playedDays = Object.keys(data).filter(day => {
      const dayNum = Number(day);
			return data.gameStates[dayNum]!.finished || data.gameStates[dayNum]!.guess.length || data.gameStates[dayNum]!.previousGuessInfo.length;
		}).length;

		return playedDays;
	}


  function getWinPercentage(): number {
		if(!data) {
			return -1;
		}

		const gameWinStatus = Object.keys(data).map(day => data.gameStates[Number(day)]!.finished);
		const totalDaysPlayed = gameWinStatus.length;
		const totalDaysWon = gameWinStatus.filter(won => won).length;

		return Math.round(totalDaysWon / totalDaysPlayed * 100);
	}

  function getStreak(day: number): number {
		let counter = 0;

		while(day in data && data.gameStates[day]!.finished) {
			counter++;
			day--;
		}

		return counter;
	}

  function getCurrentStreak(): number {
    const currentDay = wordleGameService.calculateCurrentDay();
		// Streak should be up to yesterday if today's puzzle is not finished, and include today if it is
		let streakEndDay = currentDay - 1; 
		if(data.gameStates[currentDay]?.finished) {
			streakEndDay++;
		}

		return getStreak(streakEndDay);
	}

  function getMaxStreak(): number {
		const streaks = Object.keys(data).map(day => getStreak(Number(day)));
		return Math.max(...streaks);
	}

  function getSolutionDistribution(): Record<number, number> {
		if(!data) {
			return {};
		}

		const guessesToSolve = {
			1: 0,
			2: 0,
			3: 0,
			4: 0,
			5: 0,
			unfinished: 0
		};

		for(const day in data) {
      const dayNum = Number(day);
			if(!data.gameStates[dayNum]!.finished) {
				if(data.gameStates[dayNum]!.guess.length || data.gameStates[dayNum]!.previousGuessInfo.length) {
					guessesToSolve.unfinished++;
				}
			}
			else {
				guessesToSolve[data.gameStates[dayNum]!.previousGuessInfo.length as keyof typeof guessesToSolve]++;
			}
		}

		return guessesToSolve;
	}
  
  return (
    <PopupBase close={props.close} id="stats-popup">
      <h2>Statistics</h2>

      <div id="stats-row">
        {
          data && (
            <div className="stat-container">
              <div className="stat">{ getNumberOfDaysPlayed() }</div>
              <span className="stat-label">Days played</span>
            </div>
          )
        }

        {
          data && (
            <div className="stat-container">
              <div className="stat">{ getWinPercentage() }</div>
              <div className="stat-label">Win %</div>
            </div>
          )
        }

        {
          data && (
            <div className="stat-container">
              <div className="stat">{ getCurrentStreak() }</div>
              <div className="stat-label">Current streak</div>
            </div>
          )
        }

        {
          data && (
            <div className="stat-container">
              <div className="stat">{ getMaxStreak() }</div>
              <div className="stat-label">Max streak</div>
            </div>
          )
        }
      </div>


      {
        data && (
          <>
            <h2>Solution Distribution</h2>
            <SolutionDistributionGraph data={getSolutionDistribution()} />
          </>
        )
      }
    </PopupBase>
  );
}




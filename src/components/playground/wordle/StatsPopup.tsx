import { type JSX, useState } from "react";
import { Popup } from "./Popup.tsx";
import type { GameState } from "./wordle.types.ts";
import { wordleGameService } from "./GameService.ts";
import { SolutionDistributionGraph } from "./SolutionDistributionGraph.tsx";


interface Props {
  showing: boolean
  setShowingFunc(showing: boolean): void
}


export function StatsPopup(props: Props): JSX.Element {
  const [data] = useState<Record<number, GameState>>({});

  function getNumberOfDaysPlayed(): number {
		if(!data) {
			return -1;
		}

		const playedDays = Object.keys(data).filter(day => {
      const dayNum = Number(day);
			return data[dayNum].finished || data[dayNum].guess.length || data[dayNum].previousGuessInfo.length;
		}).length;

		return playedDays;
	}


  function getWinPercentage(): number {
		if(!data) {
			return -1;
		}

		const gameWinStatus = Object.keys(data).map(day => data[Number(day)].finished);
		const totalDaysPlayed = gameWinStatus.length;
		const totalDaysWon = gameWinStatus.filter(won => won).length;

		return Math.round(totalDaysWon / totalDaysPlayed * 100);
	}

  function getStreak(day: number): number {
		let counter = 0;

		while(day in data && data[day].finished) {
			counter++;
			day--;
		}

		return counter;
	}

  function getCurrentStreak(): number {
		// Streak should be up to yesterday if today's puzzle is not finished, and include today if it is
		let streakEndDay = wordleGameService.day - 1; 
		if(wordleGameService.day in data && data[wordleGameService.day].finished) {
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
			if(!data[dayNum].finished) {
				if(data[dayNum].guess.length || data[dayNum].previousGuessInfo.length) {
					guessesToSolve.unfinished++;
				}
			}
			else {
				guessesToSolve[data[dayNum].previousGuessInfo.length as keyof typeof guessesToSolve]++;
			}
		}

		return guessesToSolve;
	}
  
  return (
    <Popup showing={props.showing} setShowingFunc={props.setShowingFunc} id="stats-popup">
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
              <div className="stat"> { getCurrentStreak() } </div>
              <div className="stat-label">Current streak</div>
            </div>
          )
        }

        {
          data && (
            <div className="stat-container">
              <div className="stat"> { getMaxStreak() } </div>
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
    </Popup>
  );
}




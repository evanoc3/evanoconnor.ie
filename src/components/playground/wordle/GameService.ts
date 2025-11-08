import { allLetters, CharState } from "./wordle.constants.ts";
import type { GameState, PreviousGuessInfo } from "./wordle.types.ts";
import { DateTime } from "luxon";


export const defaultGameState: GameState = {
  previousGuessInfo: [],
  guess: "",
  charStates: Object.fromEntries(allLetters.map(c => [c, CharState.UNKNOWN])),
  finished: false
};


const localStorageKey = "WORDLE";


export class WordleGameService {

	private _day: number;
  private _allState: Record<number, GameState> = {};


	// Public API

	constructor(day?: number) {
		this._day = day ?? this.currentDay;

		if("localStorage" in window) {
			const localStorageBlob = localStorage.getItem(localStorageKey);
			if(localStorageBlob) {
				try {
					const localStorageJson = JSON.parse(localStorageBlob);
					this._allState = localStorageJson;
				}
				catch (e) {}
			}
		}

		if(!(this._day in this._allState)) {
			this._allState[this._day] = structuredClone(defaultGameState);
		}
	}

	public get day(): number {
		return this._day;
	}

	public get currentState(): Readonly<GameState> {
		return this._allState[this._day];
	}

	public updateCurrentGuess(newGuess: string): void {
		this._allState[this._day].guess = newGuess;
		this.writeToLocalStorage();
	}

	public addGuessInfo(guessInfo: PreviousGuessInfo, charStates: Record<string, CharState>, finished: boolean): void {
		this._allState[this._day].previousGuessInfo.push(guessInfo);
		this._allState[this._day].guess = "";
		this._allState[this._day].charStates = charStates;
		this._allState[this._day].finished = finished;

		this.writeToLocalStorage();
	}

  public get allState(): Readonly<Record<number, GameState>> {
    return this._allState;
  }

	
	// Private Methods

	private get currentDay(): number {
		const now = DateTime.fromJSDate(new Date());
		const unixEpoch = DateTime.fromMillis(0);
		return now.diff(unixEpoch).as("days");
	}

	private writeToLocalStorage(): void {
		if(!("localStorage" in window)) {
			return;
		}

		localStorage.setItem(localStorageKey, JSON.stringify(this._allState));
	}

}

export const wordleGameService = new WordleGameService();

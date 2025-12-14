import { DateTime } from "luxon";
import wordleWords from "../data/wordle_words.json" assert { type: "json" };
import wordleDictionary from "../data/wordle_dictionary.json" assert { type: "json" };
import type { AppState, Character, GameState } from "../types/wordle-types.ts";
import { characters, CharacterState } from "../constants/wordle-constants.ts";

export class WordleGameService {

  private _currentDay = this.calculateCurrentDay();
  private _currentWord = this.getWordForDay(this._currentDay);

  public setCurrentDay(newCurrentDay: number): void {
    this._currentDay = newCurrentDay;

    this._currentWord = this.getWordForDay(newCurrentDay);
  }

  public get currentWord(): string {
    return this._currentWord;
  }

  public fetchPersistedAppState(): AppState | undefined {
    if(!("localStorage" in window)) {
      return undefined;
    }

    const localStorageBlob = localStorage.getItem("ie.evanoconnor.wordle");
    if(localStorageBlob) {
      try {
        const appState = JSON.parse(localStorageBlob);
        return appState;
      }
      catch (_err) {}
    }
    return undefined;
  }

  public persistAppState(appState: AppState): void {
    if(!("localStorage" in window)) {
      return;
    }

    localStorage.setItem("ie.evanoconnor.wordle", JSON.stringify(appState));
  }

  public calculateCurrentDay(): number {
    const now = DateTime.fromJSDate(new Date());
    const unixEpoch = DateTime.fromMillis(0);
    return Math.round(now.diff(unixEpoch).as("days"));
  }

  public get defaultAppState(): AppState {
    const currentDay = this.calculateCurrentDay();
    return {
      gameStates: { [currentDay]: this.defaultGameState },
      currentDay: currentDay
    };
  }

  public get defaultGameState(): GameState {
    return {
      previousGuessInfo: [],
      guess: "",
      charStates: Object.fromEntries(Object.values(characters).map(c => [c, CharacterState.UNKNOWN])) as Record<Character, CharacterState>,
      finished: false,
      targetWord: this.currentWord
    };
  }

  public wordExistsInDictionary(word: string): boolean {
    return (wordleDictionary as string[]).includes(word);
  }

  private getWordForDay(day: number): string {
    const newCurrentWordIndex = day % wordleWords.length;
    return wordleWords[newCurrentWordIndex];
  }

}

const wordleGameService = new WordleGameService();
export default wordleGameService;

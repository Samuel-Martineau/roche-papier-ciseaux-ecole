import { maxLives, toggleSoundButton } from './constants';
import {
  createSoundPlayer,
  loadBestScore,
  saveBestScore,
  updateLifebar,
  updateScoresDiv,
} from './simple_utils';
import type { createDisplayedTimer } from './simple_utils';

/**
 * @description Utilitaire pour gérer des states
 * @param startingValue La valeur de départ du state
 */
function createState<T>(startingValue?: T) {
  type Listener = (newValue: T) => void;
  let value: T = startingValue;
  const listeners: Listener[] = [];
  return {
    getValue(): T {
      return value;
    },
    subscribe(listener: Listener) {
      listeners.push(listener);
    },
    set(newValue: T) {
      value = newValue;
      listeners.forEach((func) => func(value));
    },
    reset() {
      this.set(startingValue);
    },
  };
}

export const livesState = createState(maxLives);
export const scoreState = createState(0);
export const bestScoreState = createState(loadBestScore());
export const selectTimer = createState<
  ReturnType<typeof createDisplayedTimer> | undefined
>();
export const soundPlayer = createSoundPlayer(toggleSoundButton);

livesState.subscribe((newLives) => {
  updateLifebar(newLives);
});

scoreState.subscribe((newScore) => {
  if (newScore > bestScoreState.getValue()) {
    bestScoreState.set(newScore);
  }
  updateScoresDiv(newScore, bestScoreState.getValue());
});

bestScoreState.subscribe((newBestScore) => {
  saveBestScore(newBestScore);
});

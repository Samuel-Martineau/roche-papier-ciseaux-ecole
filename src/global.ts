import { maxLives } from './constants';
import { saveBestScore, updateLifebar, updateScoresDiv } from './utils';
import type { createDisplayedTimer } from './utils';

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
export const bestScoreState = createState(
  JSON.parse(localStorage.getItem('bestScore')) || 0,
);
export const selectTimer = createState<
  ReturnType<typeof createDisplayedTimer> | undefined
>();

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

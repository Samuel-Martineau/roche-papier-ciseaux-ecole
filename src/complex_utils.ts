// Les utilitaires complexes sont ceux qui impliquent du state global

import {
  Item,
  FightResult,
  windowsCriticalStopSound,
  windowsExclamationSound,
  windowsLogoffSound,
  nextFightButton,
  finalScoreValueSpan,
  windowsLogonSound,
  fightButton,
  itemInput,
  resultSectionMessageDiv,
  timeToSelect,
} from './constants';
import { selectTimer, livesState, scoreState, soundPlayer } from './global';
import {
  getFightResult,
  showFightResult,
  wait,
  selectPanel,
  createDisplayedTimer,
  getRandomItem,
  toFactory,
} from './simple_utils';

/**
 * @description Prépare le jeu pour le prochain combat
 */
export function nextFight(): void {
  itemInput.value = 'default';
  resultSectionMessageDiv.innerHTML = '';
  fightButton.disabled = true;
  selectPanel('select');
  selectTimer.set(
    createDisplayedTimer(
      timeToSelect,
      '#timer',
      toFactory(endFight, undefined, getRandomItem()),
    ),
  );
}

/**
 * @description Gère la fin du combat
 * @param selectedItem L'item sélectionné par le joueur
 * @param computerItem L'item sélectionné par l'ordinateur
 */
export async function endFight(
  selectedItem: Item | undefined,
  computerItem: Item,
): Promise<void> {
  selectTimer.getValue()?.stop();
  const fightResult = getFightResult(selectedItem, computerItem);
  showFightResult(selectedItem, computerItem, fightResult);

  if (fightResult === FightResult.COMPUTER_WINS) {
    livesState.set(livesState.getValue() - 1);
    soundPlayer.play(windowsCriticalStopSound);
  } else {
    scoreState.set(scoreState.getValue() + 1);
    soundPlayer.play(windowsExclamationSound);
  }

  if (livesState.getValue() <= 0) {
    nextFightButton.setAttribute('disabled', 'true');
    await wait(500);
    soundPlayer.play(windowsLogoffSound);
    await wait(2000);
    selectPanel('defeat');
    finalScoreValueSpan.textContent = scoreState.getValue().toString();
    nextFightButton.removeAttribute('disabled');
    scoreState.reset();
    await wait(500);
    livesState.reset();
    soundPlayer.play(windowsLogonSound);
  }
}

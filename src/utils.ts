import {
  bestScoreValueSpan,
  defeatSection,
  fightButton,
  FightResult,
  finalScoreValueSpan,
  Item,
  itemInput,
  itemsASCIIArt,
  lifebarDiv,
  maxLives,
  nextFightButton,
  resultSection,
  resultSectionMessageDiv,
  scoreValueSpan,
  selectSection,
  timeToSelect,
  windowsCriticalStopSound,
  windowsDefaultSound,
  windowsExclamationSound,
  windowsLogoffSound,
  windowsLogonSound,
} from './constants';
import { selectTimer, livesState, scoreState } from './global';

/**
 * @description Retourne une fonction qui appelle la fonction donnée en argument avec les arguments donnés en argument
 * @param func
 * @param args
 */
export function toFactory<T extends (...args: any[]) => any>(
  func: T,
  ...args: Parameters<T>
): () => ReturnType<T> {
  return () => func(...args);
}

/**
 * @description Utilitaire qui permet d'attendre un nombre de milisecondes
 * @param ms
 */
export const wait = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

/**
 * @description Met à jour les textes qui affichent les scores (le score actuel et le meilleur score)
 * @param score
 * @param bestScore
 */
export function updateScoresDiv(score: number, bestScore: number): void {
  scoreValueSpan.innerText = score.toString();
  bestScoreValueSpan.innerText = bestScore.toString();
}

/**
 * @description Sauvegarde le meilleur score dans le localStorage
 * @param score
 */
export function saveBestScore(score: number): void {
  localStorage.setItem('bestScore', JSON.stringify(score));
}

/**
 * @description Permet de changer le panneau qui est affiché (la sélection de l'item ou le résultat du combat)
 * @param newPanel
 */
export function selectPanel(newPanel: 'select' | 'result' | 'defeat'): void {
  const hide = (el: HTMLElement) => (el.style.display = 'none');
  const show = (el: HTMLElement) => (el.style.display = 'block');

  switch (newPanel) {
    case 'select':
      show(selectSection);
      hide(resultSection);
      hide(defeatSection);
      break;
    case 'result':
      show(resultSection);
      hide(selectSection);
      hide(defeatSection);
      break;
    case 'defeat':
      show(defeatSection);
      hide(resultSection);
      hide(selectSection);
      break;
  }
}

/**
 * @description Met à jour la barre de vie
 * @param lives
 */
export function updateLifebar(lives: number): void {
  function setLifebarLevel(newLevel: 'high' | 'medium' | 'low'): void {
    lifebarDiv.setAttribute('level', newLevel);
  }

  const percentage = (lives / maxLives) * 100;
  if (percentage <= 25) setLifebarLevel('low');
  else if (percentage <= 50) setLifebarLevel('medium');
  else setLifebarLevel('high');
  lifebarDiv.style.height = `${percentage}%`;
}

/**
 * Retourne le résultat d'un combat en fonction du choix du joueur et de celui de l'ordinateur
 * @param selectedItem
 * @param computerItem
 */
export function getFightResult(
  selectedItem: Item,
  computerItem: Item,
): FightResult {
  if (selectedItem === undefined) return FightResult.COMPUTER_WINS;
  else if (
    (selectedItem === Item.rock && computerItem === Item.cisor) ||
    (selectedItem === Item.cisor && computerItem === Item.paper) ||
    (selectedItem === Item.paper && computerItem === Item.rock)
  )
    return FightResult.USER_WINS;
  else if (selectedItem === computerItem) return FightResult.TIE;
  else return FightResult.COMPUTER_WINS;
}

/**
 * @description Affiche le résultat d'un combat
 * @param selectedItem
 * @param computerItem
 * @param gameResult
 */
export function showFightResult(
  selectedItem: Item | undefined,
  computerItem: Item,
  gameResult: FightResult,
): void {
  const message = `
<pre>
${itemsASCIIArt[selectedItem || 'unknown']}
<b>V.S.</b>
${itemsASCIIArt[computerItem]}
</pre>
<hr>
${gameResult}
`;
  resultSectionMessageDiv.innerHTML = message;

  selectPanel('result');
}

/**
 * @description Retourne un item aléatoire
 */
export function getRandomItem(): Item {
  return Item[Object.values(Item)[Math.round(Math.random() * 2)]];
}

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
    windowsCriticalStopSound.play();
  } else {
    scoreState.set(scoreState.getValue() + 1);
    windowsExclamationSound.play();
  }

  if (livesState.getValue() <= 0) {
    windowsLogoffSound.play();
    nextFightButton.setAttribute('disabled', 'true');
    await wait(2500);
    selectPanel('defeat');
    finalScoreValueSpan.textContent = scoreState.getValue().toString();
    nextFightButton.removeAttribute('disabled');
    scoreState.reset();
    await wait(500);
    livesState.reset();
    windowsLogonSound.play();
  }
}

/**
 * @description Une fonction qui permet d'afficher un minuteur
 * @param seconds Le nombre de secondes que va durer le minuteur
 * @param element L'élément ciblé dans lequel le minuteur va être affiché
 */
export function createDisplayedTimer(
  seconds: number,
  elementSelector: string,
  onDone: () => void,
) {
  const element = document.querySelector(elementSelector) as HTMLElement;
  let stopped = false;

  new Promise(async () => {
    const steps = 4;
    const delay = 1000 / steps;
    for (let i = seconds; i > 0; i--) {
      windowsDefaultSound.play();
      for (let j = 0; j < steps; j++) {
        if (stopped) return;
        if (j === 0) element.textContent = i.toString();
        else element.textContent += '.';
        await wait(delay);
      }
    }
    onDone();
  });

  return {
    stop() {
      stopped = true;
    },
  };
}

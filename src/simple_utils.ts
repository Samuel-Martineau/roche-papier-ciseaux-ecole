// Les utilitaires simples sont ceux qui n'impliquent pas de state global

import {
  bestScoreValueSpan,
  defeatSection,
  FightResult,
  Item,
  itemsASCIIArt,
  lifebarDiv,
  maxLives,
  resultSection,
  resultSectionMessageDiv,
  scoreValueSpan,
  selectSection,
} from './constants';

/**
 * @description Créateur de contrôleur de son
 */
export function createSoundPlayer(toggleButton: HTMLElement) {
  const allSounds: HTMLAudioElement[] = [];
  let enabled = JSON.parse(localStorage.getItem('soundEnabled')) ?? true;
  updateUI();

  function updateUI() {
    if (enabled) toggleButton.textContent = '🔉';
    else toggleButton.textContent = '🔇';
  }

  return {
    play(sound: HTMLAudioElement) {
      sound.volume = +enabled;
      allSounds.push(sound);
      sound.play();
    },
    toggle() {
      enabled = !enabled;
      localStorage.setItem('soundEnabled', JSON.stringify(enabled));
      updateUI();
      allSounds.forEach((s) => (s.volume = +enabled));
    },
  };
}

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
 * @description Charge le meilleur score à partir du localStorage
 */
export function loadBestScore(): number {
  return JSON.parse(localStorage.getItem('bestScore')) ?? 0;
}

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
${itemsASCIIArt[selectedItem ?? 'unknown']}
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

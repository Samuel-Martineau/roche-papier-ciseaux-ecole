import {
  bestScoreValueSpan,
  fightButton,
  FightResult,
  Item,
  itemInput,
  lifebarDiv,
  maxLives,
  resultSection,
  resultSectionMessageDiv,
  scoreValueSpan,
  selectSection,
} from './constants';

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
 * @description Charge le meilleur score à partir du localStorage
 */
export function loadBestScore(): number {
  return JSON.parse(localStorage.getItem('bestScore')) || 0;
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
export function selectPanel(newPanel: 'select' | 'result'): void {
  const toHide = newPanel === 'select' ? resultSection : selectSection;
  const toShow = newPanel === 'select' ? selectSection : resultSection;

  toShow.style.display = 'block';
  toHide.style.display = 'none';
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
  if (
    (selectedItem === Item.ROCK && computerItem === Item.CISOR) ||
    (selectedItem === Item.CISOR && computerItem === Item.PAPER) ||
    (selectedItem === Item.PAPER && computerItem === Item.ROCK)
  ) {
    return FightResult.USER_WINS;
  } else if (selectedItem === computerItem) {
    return FightResult.TIE;
  } else {
    return FightResult.COMPUTER_WINS;
  }
}

/**
 * @description Affiche le résultat d'un combat
 * @param selectedItem
 * @param computerItem
 * @param gameResult
 */
export function showFightResult(
  selectedItem: Item,
  computerItem: Item,
  gameResult: FightResult,
): void {
  const message = `
<pre>
${selectedItem}
<b>V.S.</b>
${computerItem}
</pre>
<hr>
${gameResult}
`;
  resultSectionMessageDiv.innerHTML = message;

  selectPanel('result');
}

/**
 * @description Prépare le jeu pour le prochain combat
 */
export function nextFight(): void {
  itemInput.value = 'default';
  resultSectionMessageDiv.innerHTML = '';
  fightButton.disabled = true;
  selectSection.style.display = 'block';
  resultSection.style.display = 'none';
}

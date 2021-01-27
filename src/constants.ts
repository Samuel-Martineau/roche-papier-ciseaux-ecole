/**
 * @description Représente un item (roche, papier ou ciseaux)
 */
export enum Item {
  ROCK = `    _______
---'   ____)
      (_____)
      (_____)
      (____)
---.__(___)`,
  PAPER = `    ________
---'    ____)____
           ______)
          _______)
         _______)
---.__________)
`,
  CISOR = `    _______
---'   ____)____
          ______)
       __________)
      (____)
---.__(___)
`,
}

/**
 * @description Représente le résultat d'un combat
 */
export enum FightResult {
  USER_WINS = 'Vous avez gagné 😀',
  TIE = "C'est une égalité 😐",
  COMPUTER_WINS = 'Vous avez perdu 😩',
}

// Récupération d'éléments HTML
export const itemInput = document.querySelector(
  'select#item',
) as HTMLSelectElement;
export const fightButton = document.querySelector(
  'button#fight',
) as HTMLButtonElement;
export const selectSection = document.querySelector(
  '#select',
) as HTMLDivElement;
export const resultSection = document.querySelector(
  '#result',
) as HTMLDivElement;
export const resultSectionMessageDiv = resultSection.querySelector('#message');
export const nextFightButton = resultSection.querySelector(
  'button#next-fight',
) as HTMLButtonElement;
export const lifebarDiv = document.querySelector('#lifebar') as HTMLDivElement;
export const scoresDiv = document.querySelector('#scores') as HTMLDivElement;
export const scoreValueSpan = scoresDiv.querySelector(
  '#score > span',
) as HTMLSpanElement;
export const bestScoreValueSpan = scoresDiv.querySelector(
  '#best-score > span',
) as HTMLSpanElement;

// Définition de constantes de configuration
export const maxLives = 2;

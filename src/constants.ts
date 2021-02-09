/**
 * @description Représente un item
 */
export enum Item {
  rock,
  paper,
  cisor,
}
/**
 * @description Art ASCII représentant chacun des items
 */
export const itemsASCIIArt = {
  [Item.rock]: `    _______
---'   ____)
      (_____)
      (_____)
      (____)
---.__(___)`,
  [Item.paper]: `    ________
---'    ____)____
           ______)
          _______)
         _______)
---.__________)`,
  [Item.cisor]: `    _______
---'   ____)____
          ______)
       __________)
      (____)
---.__(___)`,
  unknown: `╔═══╗
║╔═╗║
╚╝╔╝║
  ║╔╝
  ╔╗
  ╚╝`,
} as const;

/**
 * @description Représente le résultat d'un combat
 */
export enum FightResult {
  USER_WINS = 'Vous avez gagné 😀',
  TIE = "C'est une égalité 😐",
  COMPUTER_WINS = 'Vous avez perdu 😩',
}

// Récupération d'éléments HTML
export const selectSection = document.querySelector(
  '#select',
) as HTMLDivElement;
export const resultSection = document.querySelector(
  '#result',
) as HTMLDivElement;
export const defeatSection = document.querySelector('#defeat') as HTMLElement;

export const itemInput = selectSection.querySelector(
  '#item',
) as HTMLSelectElement;
export const fightButton = selectSection.querySelector(
  '#fight',
) as HTMLButtonElement;

export const resultSectionMessageDiv = resultSection.querySelector(
  '#message',
) as HTMLElement;
export const nextFightButton = resultSection.querySelector(
  '#next-fight',
) as HTMLButtonElement;

export const restartButton = defeatSection.querySelector(
  '#restart',
) as HTMLButtonElement;

export const toggleSoundButton = document.querySelector(
  '#toggle-sound',
) as HTMLDivElement;
export const lifebarDiv = document.querySelector('#lifebar') as HTMLDivElement;
export const scoresDiv = document.querySelector('#scores') as HTMLDivElement;

export const scoreValueSpan = scoresDiv.querySelector(
  '#score > span',
) as HTMLSpanElement;
export const bestScoreValueSpan = scoresDiv.querySelector(
  '#best-score > span',
) as HTMLSpanElement;
export const finalScoreValueSpan = defeatSection.querySelector('#final-score');

// Réccupération de fichiers audio
export const windowsStartupSound = new Audio(
  require('./sounds/Windows_Startup.wav'),
);
export const windowsCriticalStopSound = new Audio(
  require('./sounds/Windows_Critical_Stop.wav'),
);
export const windowsExclamationSound = new Audio(
  require('./sounds/Windows_Exclamation.wav'),
);
export const windowsLogoffSound = new Audio(
  require('./sounds/Windows_Logoff_Sound.wav'),
);
export const windowsLogonSound = new Audio(
  require('./sounds/Windows_Logon_Sound.wav'),
);

// Définition de constantes de configuration
export const maxLives = 5;
export const timeToSelect = 3;

import {
  Item,
  itemInput,
  fightButton,
  nextFightButton,
  FightResult,
  maxLives,
} from './constants';
import {
  getFightResult,
  loadBestScore,
  nextFight,
  selectPanel,
  saveBestScore,
  showFightResult,
  updateLifebar,
  updateScoresDiv,
  wait,
} from './utils';

// Création de variables pour gérer l'état de la partie
let selectedItem: Item;
let lives = maxLives;
let score = 0;
let bestScore = loadBestScore();

// Mise à jour d'éléments du HTML
updateLifebar(lives);
selectPanel('select');
updateScoresDiv(score, bestScore);

// Sélection d'un item lorsque l'input[type="select"] est changé
itemInput.addEventListener('change', () => {
  const itemIsValid = itemInput.value in Item;
  if (itemIsValid) {
    fightButton.disabled = false;
    selectedItem = Item[itemInput.value];
  } else {
    fightButton.disabled = true;
    selectedItem = undefined;
  }
});

// Démarrage du prochain combat lorsque le bouton est cliqué
nextFightButton.addEventListener('click', nextFight);

// Déroulement du combat
fightButton.addEventListener('click', async () => {
  // Sélection de l'item de l'ordinateur
  const computerItem: Item = Object.values(Item)[Math.round(Math.random() * 2)];

  // Calcul du résultat du combat
  const gameResult = getFightResult(selectedItem, computerItem);

  // Affichage du résultat du combat
  showFightResult(selectedItem, computerItem, gameResult);

  // Mise à jour de la barre de vie et du score
  if (gameResult === FightResult.COMPUTER_WINS) updateLifebar(--lives);
  else updateScoresDiv(++score, bestScore);

  // Démarrage d'une nouvelle partie lorsque le nombre de vies atteint 0
  if (lives <= 0) {
    await wait(1000);

    // Remise à zéro des vies
    lives = maxLives;
    updateLifebar(lives);

    // Mise à jour du meilleur score
    if (score > bestScore) {
      bestScore = score;
      saveBestScore(bestScore);
    }

    // Remise à zéro du score
    score = 0;
    updateScoresDiv(score, bestScore);

    // Affichage du score final
    // TODO Remplacer par un panneau HTML
    alert(`Vous avez fini la partie. Votre score est de ${score}`);

    // Démarrage d'un nouveau combat
    nextFight();
  }
});

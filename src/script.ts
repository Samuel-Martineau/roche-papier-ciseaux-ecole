import {
  itemInput,
  fightButton,
  nextFightButton,
  Item,
  restartButton,
  windowsStartupSound,
} from './constants';
import { nextFight, selectPanel, getRandomItem, endFight } from './utils';
import { livesState, bestScoreState, scoreState } from './global';

windowsStartupSound.play();

// Création de variables pour gérer l'état de la partie
let selectedItem: Item | undefined;

// Mise à jour d'éléments du HTML
selectPanel('select');
livesState.reset();
bestScoreState.reset();
scoreState.reset();

// Sélection d'un item lorsque l'input est changé
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
restartButton.addEventListener('click', nextFight);

// Déroulement du combat
fightButton.addEventListener('click', async () => {
  // Sélection de l'item de l'ordinateur
  const computerItem = getRandomItem();
  // Fin du combat
  endFight(selectedItem, computerItem);
});

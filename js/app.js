/*-------------------------------- Imports --------------------------------*/
import { showScreen, renderAnimalChoices } from "./screenFactory.js";
import { playerAttack } from "./combatFactory.js";
import { animals } from "./data.js"; 


/*-------------------------------- Constants --------------------------------*/

export const choices = ['rock', 'paper', 'scissors'];
export const gameState = {
  round: 1,
  turn: 1,
  player: null,
  enemy: null,
  firstAttackUsed: false,
  refreshUsed: false,
  maxRounds: 6,
  currentTurn: "player",
  playerRPS: null,
  enemyRPS: null,
};


/*---------------------------- Variables (state) ----------------------------*/

let playerChoice;
let computerChoice; 
let msg;
let refreshUsed;

/*------------------------ Cached Element References ------------------------*/



/*-------------------------------- Functions --------------------------------*/



/*----------------------------- Event Listeners -----------------------------*/

document.getElementById("start-btn").addEventListener("click", () => {
  showScreen("animal-selection-screen");
  renderAnimalChoices();
});

document.getElementById("reset-btn").addEventListener("click", () => {
  showScreen("start-screen");
  refreshUsed = false;
  document.getElementById("generate-btn").disabled = false;
});

document.getElementById("generate-btn").addEventListener("click", () => {
  if (refreshUsed) {
    return;
  }

  refreshUsed = true;
  renderAnimalChoices();
  document.getElementById("generate-btn").disabled = true;
});

document.getElementById("attack-btn").addEventListener("click", () => {
  playerAttack();
});
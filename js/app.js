/*-------------------------------- Imports --------------------------------*/
import { showScreen, renderAnimalChoices } from "./screenFactory.js";
import { onPlayerRPSClick } from "./combatFactory.js";

/*---------------------------- Variables (state) ----------------------------*/

let refreshUsed;

/*-------------------------------- Constants --------------------------------*/

export const choices = ['rock', 'paper', 'scissors'];

export const gameState = {
  round: 1,
  turn: 1,
  player: null,
  enemy: null,
  playerBuff: null,
  enemyBuff: null,
  enemyCurrentDmg: 0,
  firstAttackUsed: false,
  refreshUsed: false,
  maxRounds: 6,
  currentTurn: "player",
  playerAttackRPS: null,
  playerDefendRPS: null,
  playerLastRPS: null,
  enemyRPS: null,
  playerSelected: 0
};

/*----------------------------- Event Listeners -----------------------------*/

//Start game button
document.getElementById("start-btn").addEventListener("click", () => {
  showScreen("animal-selection-screen");
  renderAnimalChoices();
});

//Cancel button to go back to main page
document.getElementById("reset-btn").addEventListener("click", () => {
  showScreen("start-screen");
  refreshUsed = false;
  document.getElementById("generate-btn").disabled = false;
});

//Home button to go back to main page
document.getElementById("cancel-btn").addEventListener("click", () => {
  showScreen("start-screen");
  refreshUsed = false;
});

//Refresh animal selections
document.getElementById("generate-btn").addEventListener("click", () => {
  if (refreshUsed) {
    return;
  }
  refreshUsed = true;
  renderAnimalChoices();
  document.getElementById("generate-btn").disabled = true;
});

/* RPS Choice listener */
document.querySelectorAll(".rps-square").forEach(element => {
  if (element.id.startsWith("player-")) {
    element.addEventListener("click", onPlayerRPSClick);
  }
});
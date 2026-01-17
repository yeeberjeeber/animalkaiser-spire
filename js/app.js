/*-------------------------------- Imports --------------------------------*/
import { showScreen, renderAnimalChoices } from "./screenFactory.js";
import { animals } from "./data.js"; 


/*-------------------------------- Constants --------------------------------*/

const choices = ['rock', 'paper', 'scissors'];


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
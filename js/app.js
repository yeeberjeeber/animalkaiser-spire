/*-------------------------------- Imports --------------------------------*/
console.log("App.js loaded");
import { showScreen } from "./ui.js";
import { renderAnimalChoices } from "./screenFactory.js";
import { animals } from "./animalData.js"; 


/*-------------------------------- Constants --------------------------------*/

const choices = ['rock', 'paper', 'scissors'];


/*---------------------------- Variables (state) ----------------------------*/

let playerChoice;
let computerChoice; 
let msg;

/*------------------------ Cached Element References ------------------------*/



/*-------------------------------- Functions --------------------------------*/



/*----------------------------- Event Listeners -----------------------------*/

document.getElementById("start-btn").addEventListener("click", () => {
  console.log("JS loaded");
  showScreen("animal-selection-screen");
  renderAnimalChoices();
});
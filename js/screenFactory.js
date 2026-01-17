import { animals } from "./animalData.js";
import { createPlayer } from "./combatFactory.js";
import { showScreen } from "./ui.js";

/* SCREEN FUNCTIONS */

export function renderAnimalChoices() {
  const container = document.getElementById("animal-options");
  container.innerHTML = ""; // Clear previous cards if any

  // Randomly pick 3 animals
  const choices = [...animals]
    .sort(() => Math.random() - 0.5) // shuffle
    .slice(0, 3);

  console.log("Animal choices:", choices); // for debugging

  // ---- THIS IS WHERE YOUR CARD CREATION GOES ----
  choices.forEach(animal => {
    const card = document.createElement("div");
    card.classList.add("animal-card", animal.rarity.toLowerCase());
    
    card.innerHTML = `
      <h3>${animal.name}</h3>
      <p>HP: ${animal.maxHP}</p>
      <p>Damage: ${animal.dmgMin}-${animal.dmgMax}</p>
      <p>Rarity: ${animal.rarity}</p>
    `;

    card.addEventListener("click", () => {
      gameState.player = createPlayerAnimal(animal);
      showScreen("battle-screen");
      startBattle();
    });

    container.appendChild(card);
  });
}
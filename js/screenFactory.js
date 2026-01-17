import { animals } from "./animalData.js";
import { startBattle, createPlayer } from "./combatFactory.js";

const screens = document.querySelectorAll(".screen");

/* SCREEN FUNCTIONS */

//Changing screens, keep hidden if moving to next screen
export function showScreen(screenId) {
  screens.forEach(screen => {
    screen.classList.add("hidden");
  });

  document.getElementById(screenId).classList.remove("hidden");
}

//Generating 3 Animal cards to choose
export function renderAnimalChoices() {
  const container = document.getElementById("animal-options");
  container.innerHTML = "";

  // Randomly pick 3 animals
  const choices = [...animals]
    .sort(() => Math.random() - 0.5) // shuffle
    .slice(0, 3);

  // ---- ANIMAL CARD CREATION ----
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

export function setupBattleScreen() {
  const player = gameState.player;
  const enemy = gameState.enemy;

  // Set names
  document.getElementById("player-name").textContent = player.name;
  document.getElementById("enemy-name").textContent = enemy.name;

  // Initialize HP bars
  updateHP();
}

function updateHP() {
  const playerHPPercent = (gameState.player.currentHP / gameState.player.maxHP) * 100;
  const enemyHPPercent = (gameState.enemy.currentHP / gameState.enemy.maxHP) * 100;

  // Update bars
  document.getElementById("player-hp-bar").style.width = playerHPPercent + "%";
  document.getElementById("enemy-hp-bar").style.width = enemyHPPercent + "%";

  // Update text
  document.getElementById("player-hp-text").textContent = 
    `HP: ${gameState.player.currentHP} / ${gameState.player.maxHP}`;
  document.getElementById("enemy-hp-text").textContent = 
    `HP: ${gameState.enemy.currentHP} / ${gameState.enemy.maxHP}`;
}

export function renderPowerChoices() {
  const container = document.getElementById("power-options");
  container.innerHTML = ""; // Clear previous cards if any

  // Randomly pick 3 animals
  const choices = [...animals]
    .sort(() => Math.random() - 0.5) // shuffle
    .slice(0, 5);

  console.log("Animal choices:", choices); // for debugging

  // ---- ANIMAL CARD CREATION ----
  choices.forEach(animal => {
    const card = document.createElement("div");
    card.classList.add("power-card", animal.rarity.toLowerCase());
    
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


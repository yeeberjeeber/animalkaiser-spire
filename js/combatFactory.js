//Function js file

import { animals, rarityPassives, enemies } from './data.js';
import { setupBattleScreen, updateHP, showScreen } from './screenFactory.js';
import { gameState } from "./app.js";
import { applyPassive } from "./passiveEngine.js";

/* GAMEPLAY FUNCTIONS */

//Rolling damage each turn
function rollDamage(attacker) {
  let damage;

  if (Math.random() < 0.1) {
    damage = attacker.dmgMax;
  } else {
    const roll = (Math.random() + Math.random()) / 2;
    damage = Math.floor(
      roll * (attacker.dmgMax - attacker.dmgMin + 1)
    ) + attacker.dmgMin;
  }

  return damage;
} 

//Creating Player Animal from selection
export function createPlayer(animal) {
    return {
      ...animal,
      currentHP: animals.maxHP,
      passives: rarityPassives[animals.rarity],
      enhancements: []
    };
}

function onTurnStart() {
  applyPassive(gameState.player, "onTurnStart");
  applyPassive(gameState.enemy, "onTurnStart");

  updateHP();
}

function startRound() {
  gameState.firstAttackUsed = false;
}

function getDifficultyForRound(round) {
  if (round >= 1 && round <= 2) return "Easy";
  if (round >= 3 && round <= 4) return "Medium";
  if (round === 5) return "Hard";
  if (round === 6) return "Boss"; // last round
  return "Easy"; // fallback, in case round is invalid
}

//Creating the enemy for each round
export function getRandomEnemyForRound(round) {
  const difficulty = getDifficultyForRound(round);

  // Filter enemies by difficulty
  const possibleEnemies = enemies.filter(enemy => enemy.difficulty === difficulty);

  // Pick one at random
  const randomIndex = possibleEnemies[Math.floor(Math.random() * possibleEnemies.length)];
  
  // Create combat-ready enemy
  const enemy = {
    ...randomIndex,
    currentHP: randomIndex.maxHP,
  };

  return enemy;
}

export function endRound() {
  gameState.round++;
  // proceed to next battle or end game if round exceeds max

  startRound();

  // Check if last round is over
  if (gameState.round > gameState.maxRounds) {
    addBattleLog("Congratulations! You completed the game!");
    // Optionally show a victory screen
    showScreen("victory-screen");
    return;
  }

  // Generate next enemy for the new round
  gameState.enemy = getRandomEnemyForRound(gameState.round);

  // Show battle screen again
  setupBattleScreen();

  // Clear battle log for the new round
  document.getElementById("battle-log").textContent = "";
}

function gameOver() {
  // Reset game state if needed
  gameState.round = 1;
  gameState.player = null;
  gameState.enemy = null;
  gameState.firstAttackUsed = false;

  // Show home screen
  showScreen("start-screen");
}

//Enemy attack calculation
function enemyAttack() {
  const damage = rollDamage(gameState.enemy);
  gameState.player.currentHP -= damage;
  if (gameState.player.currentHP < 0) gameState.player.currentHP = 0;

  console.log(`${gameState.enemy.name} hits ${gameState.player.name} for ${damage} damage!`);
  updateHP();

  if (gameState.player.currentHP <= 0) {
    console.log(`${gameState.player.name} is defeated!`);
    setTimeout(gameOver, 500);
    return;
  }
}

//Player attack calculation
function playerAttack() {
  let damage = rollDamage(gameState.player);

   // Bronze passive
  damage = applyPassive(gameState.player, "onAttack", damage);

  // Gold passive
  damage = applyPassive(gameState.player, "onFirstAttack", damage, gameState);

  gameState.enemy.currentHP -= damage;
  if (gameState.enemy.currentHP < 0) gameState.enemy.currentHP = 0;

  console.log(`${gameState.player.name} hits ${gameState.enemy.name} for ${damage} damage!`);
  updateHP();

  if (gameState.enemy.currentHP <= 0) {
    console.log(`${gameState.enemy.name} is defeated!`);
    setTimeout(endRound, 500);
    return;
  }

  // Enemy counterattack
  setTimeout(enemyAttack, 500);
}



//Starting the Battle
export function startBattle() {
  // Check for player
  if (!gameState.player) return console.error("No player selected!");

  gameState.player.currentHP = gameState.player.maxHP;
  gameState.player.passives = rarityPassives[gameState.player.rarity]
  
  // Picking a random enemy
  gameState.enemy = getRandomEnemyForRound(gameState.round || 1);
  gameState.enemy.currentHP = gameState.enemy.maxHP; // full HP

  setupBattleScreen();

  const attackBtn = document.getElementById("attack-btn");

  attackBtn.onclick = () => playerAttack();

  // Optional: clear battle log
  document.getElementById("battle-log").textContent = "";

  onTurnStart();
  startRound();
}


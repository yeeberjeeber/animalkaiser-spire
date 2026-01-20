//Function js file

import { animals, rarityPassives, enemies } from './data.js';
import { setupBattleScreen, updateHP, showScreen } from './screenFactory.js';
import { gameState, choices } from "./app.js";
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

//Rock Paper Scissors rolling functions
function rollRPS() {
  return choices[Math.floor(Math.random() * choices.length)];
} 

function updateRPSUI() {
  document.querySelectorAll(".rps-square").forEach(el => {
    el.classList.remove("selected");

    if (el.id === `player-${gameState.playerRPS}`) {
      el.classList.add("selected");
    }

    if (el.id === `enemy-${gameState.enemyRPS}`) {
      el.classList.add("selected");
    }
  });
}

function resolveRPS(player, enemy) {
  if (player === enemy) return "draw";
  if (
    (player === "rock" && enemy === "scissors") ||
    (player === "paper" && enemy === "rock") ||
    (player === "scissors" && enemy === "paper")
  ) return "win";
  return "lose";
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

export function endTurn() {
  gameState.turn++;
  // proceed to next turn

  if(gameState.currentTurn === "player"){
    gameState.currentTurn = "enemy";
  } else {
    gameState.currentTurn = "player";
    onTurnStart();
  }

  if (gameState.currentTurn === "enemy") {
  setTimeout(enemyAttack, 700);
  }

  return;
}

export function endRound() {
  gameState.round++;
  // proceed to next battle or end game if round exceeds max

  gameState.turn = 1;

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
  gameState.refreshUsed = false;
  gameState.currentTurn = "player";
  gameState.playerRPS = null;
  gameState.enemyRPS = null;


  // Show home screen
  showScreen("start-screen");
}

//Enemy attack calculation
function enemyAttack() {
  gameState.enemyRPS = rollRPS();
  gameState.playerRPS = rollRPS();

  updateRPSUI();

  const outcome = resolveRPS(
    gameState.enemyRPS,
    gameState.playerRPS
  );

  if(outcome === "win"){
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
}

//Player attack calculation
export function playerAttack() {
  gameState.playerRPS = rollRPS();
  gameState.enemyRPS = rollRPS();

  updateRPSUI();

  console.log(gameState.playerRPS);
  console.log(gameState.enemyRPS);

  const outcome = resolveRPS(gameState.playerRPS, gameState.enemyRPS);
  console.log(outcome);

  if (outcome === "win") {
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
      setTimeout(endTurn, 500);
      setTimeout(endRound, 500);
      return;
    }

    endTurn();

  } else {

    endTurn();

  }
  
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

  //Clear battle log
  document.getElementById("battle-log").textContent = "";

  onTurnStart();
  startRound();
}


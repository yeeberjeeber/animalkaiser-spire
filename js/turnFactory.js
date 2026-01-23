//Turn related functions

import { updateHP, addBattleLog, setupBattleScreen, showScreen } from "./screenFactory.js";
import { enemyAttack, applyPassive, applyPowers, updateRPSUI } from "./combatFactory.js"
import { enemies } from "./data.js";
import { gameState } from "./app.js";

/* TURN BASED FUNCTIONS */
export function onTurnStart() {

  //Heal 15 HP Passive for Common
  const passive = applyPassive(gameState.player, "onTurnStart");

  if(gameState.player.rarity === "Common") {
    addBattleLog("Player heals 15 HP!");
  }

  updateHP();
}

export function startRound() {
  gameState.firstAttackUsed = false;

  //Apply power if any
  const power = applyPowers(gameState.player, "onRoundStart")
  addBattleLog("Healing power applied!");
  
  updateHP();
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
  gameState.enemyRPS = null;
  updateRPSUI();

  if(gameState.currentTurn === "player"){
    gameState.currentTurn = "enemy";
    addBattleLog("Enemy's turn");
  } else {
    gameState.currentTurn = "player";
  
    // proceed to next turn
    gameState.turn++;

    addBattleLog(`Turn: ${gameState.turn}`);
    addBattleLog(`Player's turn to attack`);
    onTurnStart();
  }

  if (gameState.currentTurn === "enemy") {
  setTimeout(addBattleLog("This is the enemy's turn to attack."), 500);
  enemyAttack();
  }

  return;
}

export function endRound() {
  gameState.round++;
  // proceed to next battle or end game if round exceeds max

  gameState.turn = 1;
  gameState.enemyRPS = null;

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

export function gameOver() {
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
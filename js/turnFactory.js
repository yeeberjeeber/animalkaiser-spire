//Turn related functions

import { updateHP, addBattleLog, setupBattleScreen, showScreen } from "./screenFactory.js";
import { enemyAttack, updateRPSUI } from "./combatFactory.js"
import { enemies } from "./data.js";
import { gameState } from "./app.js";
import { applyPassive, applyPowers } from './engine.js';

/* TURN BASED FUNCTIONS */
export function onTurnStart() {

  if(gameState.currentTurn === 'player') {
    if (document.getElementById('player-turn').classList.contains('bg-primary')) {
      document.getElementById('player-turn').classList.add('shadow-lg');
      document.getElementById('enemy-turn').classList.remove('shadow-lg');
      document.getElementById('enemy-turn').classList.remove('bg-danger');
      document.getElementById('enemy-turn').classList.add('bg-secondary');
    } else {
      document.getElementById('player-turn').classList.add('shadow-lg');
      document.getElementById('player-turn').classList.remove('bg-secondary');
      document.getElementById('player-turn').classList.add('bg-primary');
      document.getElementById('enemy-turn').classList.remove('shadow-lg');
      document.getElementById('enemy-turn').classList.remove('bg-danger');
      document.getElementById('enemy-turn').classList.add('bg-secondary');
    }
  } else {
    document.getElementById('enemy-turn').classList.add('shadow-lg');
    document.getElementById('enemy-turn').classList.remove('bg-secondary');
    document.getElementById('enemy-turn').classList.add('bg-danger');
    document.getElementById('player-turn').classList.remove('shadow-lg');
    document.getElementById('player-turn').classList.remove('bg-primary');
    document.getElementById('player-turn').classList.add('bg-secondary');
  }

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
  console.log("Healing power applied!");
  
  updateHP();
}

function getDifficultyForRound(round) {
  if (round >= 1 && round <= 2) return "Easy";
  if (round >= 3 && round <= 4) return "Medium";
  if (round === 5) return "Hard";
  if (round === 6) return "Boss";
  return "Easy";
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
  } else {
    gameState.currentTurn = "player";
  
    // proceed to next turn
    gameState.turn++;

    document.getElementById('turn-number').textContent = `Turn: ${gameState.turn}`;

    onTurnStart();
  }

  if (gameState.currentTurn === "enemy") {
  
  //Setting the colors
  document.getElementById('enemy-turn').classList.add('shadow-lg');
  document.getElementById('enemy-turn').classList.remove('bg-secondary');
  document.getElementById('enemy-turn').classList.add('bg-danger');
  document.getElementById('player-turn').classList.remove('shadow-lg');
  document.getElementById('player-turn').classList.remove('bg-primary');
  document.getElementById('player-turn').classList.add('bg-secondary');

  enemyAttack();
  }

  return;
}

export function endRound() {
  gameState.round++;

  gameState.turn = 1;
  gameState.enemyRPS = null;

  
  document.getElementById('round-number').textContent = `Round: ${gameState.round}`;
  document.getElementById('turn-number').textContent = `Turn: ${gameState.turn}`;

  startRound();

  if (gameState.round > gameState.maxRounds) {
    addBattleLog("Congratulations! You completed the game!");
    //Show a victory screen
    showScreen("victory-screen");
    return;
  }

  //Generate next enemy for the new round
  gameState.enemy = getRandomEnemyForRound(gameState.round);

  //Show battle screen again
  setupBattleScreen();

  //Clear battle log for the new round
  document.getElementById("battle-log").textContent = "";
}

export function gameOver() {
  //Reset game state if needed
  gameState.round = 1;
  gameState.player = null;
  gameState.enemy = null;
  gameState.firstAttackUsed = false;
  gameState.refreshUsed = false;
  gameState.currentTurn = "player";
  gameState.playerRPS = null;
  gameState.enemyRPS = null;


  //Show home screen
  showScreen("start-screen");
}
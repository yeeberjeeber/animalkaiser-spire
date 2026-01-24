//Turn related functions

import { updateHP, addBattleLog, setupBattleScreen, showScreen, changeFirstPlayerTurnUI, changePlayerTurnUI, changeEnemyTurnUI } from "./screenFactory.js";
import { enemyAttack, updateRPSUI, rollBuff } from "./combatFactory.js"
import { enemies } from "./data.js";
import { gameState } from "./app.js";
import { applyPassive, applyPowers } from './engine.js';

/* TURN BASED FUNCTIONS */
export function onTurnStart() {

  if(gameState.currentTurn === 'player') {
    if (document.getElementById('player-turn').classList.contains('bg-primary')) {
      changeFirstPlayerTurnUI();
    } else {
      changePlayerTurnUI();
    }
  } else {
    changeEnemyTurnUI();
  }

  //Heal 15 HP Passive for Common
  applyPassive(gameState.player, "onTurnStart");

  updateHP();
}

export function startRound() {

  gameState.firstAttackUsed = false;
  rollBuff();

  if (!gameState.player) return;
  gameState.player.activePowers = gameState.player.activePowers || [];
  
  if (gameState.player?.activePowers) {
    gameState.player.activePowers = gameState.player.activePowers.filter (power => {
      if (power.type === "heal") {
        applyPowers(gameState.player, "onRoundStart")
        console.log("Healing power applied!");
        return false;
      }
      return true;
    })
  }
  
  
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
  changeEnemyTurnUI();

  setTimeout(600);

  enemyAttack();
  }

  return;
}

export function endRound() {
  gameState.round++;

  gameState.turn = 1;
  gameState.enemyRPS = null;
  gameState.playerBuff = null;

  document.querySelectorAll("rps-square").forEach(el => {
    el.classList.remove("disabled");
  });

  gameState.playerLastRPS = null;
  gameState.playerSelected = 0;

  
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
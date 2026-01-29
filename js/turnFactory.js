//Turn related functions

import { updateHP, addBattleLog, setupBattleScreen, showScreen, changeFirstPlayerTurnUI, changePlayerTurnUI, changeEnemyTurnUI, renderBuffIcons, renderPassives } from "./screenFactory.js";
import { enemyAttack, updateRPSUI, resetRPSUI, rollBuff } from "./combatFactory.js"
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
  renderBuffIcons(gameState.player, "player-buffs");

  updateHP();
}

export function startRound() {

  gameState.firstAttackUsed = false;
  rollBuff();

  renderBuffIcons(gameState.player, "player-buffs");

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
    randomBuffs: [],
    baseCritChance: 0.1,
    baseCritMultiplier: 1.5,
    spriteOffsetX: 0
  };

  return enemy;
}

export function endTurn() {
  gameState.enemyRPS = null;
  gameState.playerLastRPS = gameState.playerAttackRPS;

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
  gameState.playerAttackRPS = null;
  gameState.playerDefendRPS = null;
  gameState.enemyRPS = null;
  gameState.enemyCurrentDmg = 0;
  gameState.playerBuff = null;
  gameState.player.randomBuffs = [];
  gameState.enemy.randomBuffs = [];

  renderBuffIcons(gameState.player, "player-buffs");
  renderBuffIcons(gameState.enemy, "enemy-buffs");
  resetRPSUI();

  gameState.playerLastRPS = null;
  gameState.playerSelected = 0;

  
  document.getElementById('round-number').textContent = `Round: ${gameState.round}`;
  document.getElementById('turn-number').textContent = `Turn: ${gameState.turn}`;

  startRound();

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
  gameState.turn = 1;
  gameState.player = null;
  gameState.enemy = null;
  gameState.firstAttackUsed = false;
  gameState.refreshUsed = false;
  gameState.currentTurn = "player";
  gameState.playerAttackRPS = null;
  gameState.playerDefendRPS = null;
  gameState.enemyRPS = null;
  gameState.playerBuff = null;
  gameState.enemyBuff = null;

  renderPassives(gameState.player, "player-buffs");  
  renderBuffIcons(gameState.player, "player-buffs");
  renderBuffIcons(gameState.enemy, "enemy-buffs");
  resetRPSUI();

  //Show home screen
  showScreen("end-screen");
}
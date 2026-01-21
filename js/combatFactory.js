//Function js file

import { animals, rarityPassives, enemies } from './data.js';
import { setupBattleScreen, updateHP, showScreen, renderPowerChoices, addBattleLog } from './screenFactory.js';
import { gameState, choices } from "./app.js";

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

/* ROCK PAPER SCISSORS FUNCTIONS */
function rollRPS() {
  return choices[Math.floor(Math.random() * choices.length)];
} 

//Highlight the selected box
function updateRPSUI() {
  //Checks each square under rps-square class
  document.querySelectorAll(".rps-square").forEach(el => {
    el.classList.remove("selected");

    //Adds a selected to the class once checked for selection match
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

/* CREATE PLAYER FUNCTION */
export function createPlayer(animal) {
    return {
      ...animal,
      currentHP: animal.maxHP,
      passives: rarityPassives[animal.rarity], //lookup to get passive effects
      enhancements: []
    };
}


/* TURN BASED FUNCTIONS */
function onTurnStart() {
  //Heal 15 HP Passive for Common
  const passive = applyPassive(gameState.player, "onTurnStart");
  console.log(passive);

  if (passive === true) {
    addBattleLog("Player heals 15 HP!");
  }
  
  updateHP();
}

function startRound() {
  gameState.firstAttackUsed = false;

  //Apply power if any
  const power = applyPowers(gameState.player, "onRoundStart")
  console.log(power);

  if (power === true) {
    addBattleLog("Healing power applied!");
  }
  
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
  gameState.turn++;
  // proceed to next turn

  gameState.playerRPS = null;
  gameState.enemyRPS = null;
  updateRPSUI();

  if(gameState.currentTurn === "player"){
    gameState.currentTurn = "enemy";
    addBattleLog("Enemy's turn");
  } else {
    gameState.currentTurn = "player";
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
  gameState.playerRPS = null;
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


/* ATTACK FUNCTIONS */
//Helper function
function applyPassive(entity, hook, value = null, context = {}) {
  //To check if gameState.player has passives (it should)
  if (!entity || !entity.passives) return value;

 //Get the function for the specific hook e.g. onAttack, onFirstAttack
  const func = entity.passives[hook];
  if (!func) return value;

  //Calling functon in rarityPassives
  return func(entity, value, context) ?? value;
}

//Power card function
function applyPowers(entity, hook, value = null, context = {}) {
  if (!entity?.activePowers) return value;

  let result = value;

  for (const power of entity.activePowers) {
    const fn = power[hook];
    if (typeof fn === "function") {
      result = fn(entity, result, context) ?? result;
    }
  }

  return result;
}

//Enemy attack calculation
function enemyAttack() {
  gameState.enemyRPS = rollRPS();
  gameState.playerRPS = rollRPS();

  setTimeout(() => {
    updateRPSUI();

    console.log(gameState.playerRPS);
    console.log(gameState.enemyRPS);

    const outcome = resolveRPS(gameState.enemyRPS, gameState.playerRPS);

    addBattleLog(`Enemy ${outcome}`);

    if(outcome === "win"){
      const damage = rollDamage(gameState.enemy);
      gameState.player.currentHP -= damage;
      if (gameState.player.currentHP < 0) gameState.player.currentHP = 0;

      addBattleLog(`${gameState.enemy.name} hits ${gameState.player.name} for ${damage} damage!`);
      updateHP();

      if (gameState.player.currentHP <= 0) {
        addBattleLog(`${gameState.player.name} is defeated!`);
        setTimeout(gameOver, 500);
        return;
      }

      endTurn();
    }
  }, 600);
}

//Player attack calculation
export function playerAttack() {
  gameState.playerRPS = rollRPS();
  gameState.enemyRPS = rollRPS();

  updateRPSUI();

  console.log(gameState.playerRPS);
  console.log(gameState.enemyRPS);

  const outcome = resolveRPS(gameState.playerRPS, gameState.enemyRPS);
  addBattleLog(`Player ${outcome}`);

  if (outcome === "win") {
    let damage = rollDamage(gameState.player);

   // Bronze passive
    damage = applyPassive(gameState.player, "onAttack", damage);

    // Gold passive
    damage = applyPassive(gameState.player, "onFirstAttack", damage, gameState);

    //Apply damage power if any
    damage = applyPowers(gameState.player, "onAttack", damage);

    gameState.enemy.currentHP -= damage;
    if (gameState.enemy.currentHP < 0) gameState.enemy.currentHP = 0;

    addBattleLog(`${gameState.player.name} hits ${gameState.enemy.name} for ${damage} damage!`);
    updateHP();

    endTurn();

    if (gameState.enemy.currentHP <= 0) {
      addBattleLog(`${gameState.enemy.name} is defeated!`);
      setTimeout(showScreen("power-selection-screen"), 500);
      renderPowerChoices();
      return;
    }

  } else {

    endTurn();

  }
  
}


/* START COMBAT FUNCTION */
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


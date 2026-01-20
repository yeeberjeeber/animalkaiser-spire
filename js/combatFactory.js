//Function js file

import { animals, rarityPassives, enemies } from './data.js';
import { setupBattleScreen, updateHP, showScreen, renderPowerChoices } from './screenFactory.js';
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

/* CREATE PLAYER FUNCTION */
export function createPlayer(animal) {
    return {
      ...animal,
      currentHP: animals.maxHP,
      passives: rarityPassives[animals.rarity], //lookup to get passive effects
      enhancements: []
    };
}


/* TURN BASED FUNCTIONS */
function onTurnStart() {
  applyPassive(gameState.player, "onTurnStart");

  updateHP();
}

function startRound() {
  gameState.firstAttackUsed = false;

   // Apply stored heal from power card
  if (gameState.player.nextTurnHeal) {
    gameState.player.currentHP = Math.min(
      gameState.player.currentHP + gameState.player.nextTurnHeal,
      gameState.player.maxHP
    );
    console.log(`${gameState.player.name} heals ${gameState.player.nextTurnHeal} HP from Healing Aura!`);
  }
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
    console.log("Enemy's turn")
  } else {
    gameState.currentTurn = "player";
    onTurnStart();
  }

  if (gameState.currentTurn === "enemy") {
  console.log("This is the enemy's turn to attack.")
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

 //Getting the function for the specific hook e.g. onAttack, onFirstAttack
  const fn = entity.passives[hook];
  if (!fn) return value;

  //Calling functon in rarityPassives
  return fn(entity, value, context) ?? value;
}

//Enemy attack calculation
function enemyAttack() {
  gameState.enemyRPS = rollRPS();
  gameState.playerRPS = rollRPS();

  setTimeout(() => {
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
  console.log(outcome);

  if (outcome === "win") {
    let damage = rollDamage(gameState.player);

   // Bronze passive
    damage = applyPassive(gameState.player, "onAttack", damage);

    // Gold passive
    damage = applyPassive(gameState.player, "onFirstAttack", damage, gameState);

    //Apply power card
    if (gameState.playerPower?.effect) {
      gameState.playerPower.effect(gameState.player, gameState.enemy, gameState);

      updateHP();
    }

    // Apply any bonus stored by the power
    if (gameState.player.nextAttackBonus) {
      damage += gameState.player.nextAttackBonus;
    }

    gameState.enemy.currentHP -= damage;
    if (gameState.enemy.currentHP < 0) gameState.enemy.currentHP = 0;

    console.log(`${gameState.player.name} hits ${gameState.enemy.name} for ${damage} damage!`);
    updateHP();

    if (gameState.enemy.currentHP <= 0) {
      console.log(`${gameState.enemy.name} is defeated!`);
      showScreen("power-selection-screen");
      renderPowerChoices();
      return;
    }

    endTurn();

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


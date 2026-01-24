//Function js file

import { rarityPassives } from './data.js';
import { setupBattleScreen, updateHP, showScreen, renderPowerChoices, addBattleLog, drawSprite } from './screenFactory.js';
import { onTurnStart, startRound, getRandomEnemyForRound, endTurn, gameOver} from './turnFactory.js';
import { gameState, choices } from "./app.js";
import { applyPassive, applyPowers } from './engine.js';

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
function rollEnemyRPS() {
  return choices[Math.floor(Math.random() * choices.length)];
} 

//Highlight the selected box
export function updateRPSUI() {
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
      sprite: animal.sprite
    };
}

/* ATTACK FUNCTIONS */
// //Enemy attack calculation
export function enemyAttack() {

  gameState.enemyRPS = rollEnemyRPS();
  
  setTimeout(() => {
    drawSprite(gameState.enemy, "attack", "enemy-canvas");
    drawSprite(gameState.enemy, "idle", "enemy-canvas");
  }, 500 );
  

  console.log(gameState.enemyRPS);
}

export function playerDefend(event) {
  if (gameState.currentTurn !== "enemy") return;

  const playerChoice = event.target.id.replace("player-", "");

  gameState.playerRPS = playerChoice;

  updateRPSUI();

  const outcome = resolveRPS(gameState.enemyRPS, playerChoice);

  if(outcome === "win"){

    drawSprite(gameState.player, "hurt", "player-canvas");

    const damage = rollDamage(gameState.enemy);
    gameState.player.currentHP -= damage;
    if (gameState.player.currentHP < 0) gameState.player.currentHP = 0;

    addBattleLog(`${gameState.enemy.name} hits ${gameState.player.name} for ${damage} damage!`);
    updateHP();

    setTimeout(() => {
      drawSprite(gameState.player, "idle", "player-canvas");
      
    }, 300);

    if (gameState.player.currentHP <= 0) {
      addBattleLog(`${gameState.player.name} is defeated!`);
      setTimeout(gameOver, 500);
      return;
    }

    endTurn();
  } else {

    endTurn();

  }

}

//Player attack calculation
export function playerAttack(event) {

  drawSprite(gameState.player, "attack", "player-canvas");

  const playerChoice = event.target.id.replace("player-", "");
  gameState.playerRPS = playerChoice;
  gameState.enemyRPS = rollEnemyRPS();

  updateRPSUI();

  console.log(playerChoice);
  console.log(gameState.enemyRPS);

  const outcome = resolveRPS(playerChoice, gameState.enemyRPS);

  if (outcome === "win") {

    drawSprite(gameState.enemy, "hurt", "enemy-canvas");

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

    setTimeout(() => {
      drawSprite(gameState.player, "idle", "player-canvas");
      drawSprite(gameState.enemy, "idle", "enemy-canvas");
    }, 300);

    if (gameState.enemy.currentHP <= 0) {
      addBattleLog(`${gameState.enemy.name} is defeated!`);
      setTimeout(() => {
        showScreen("power-selection-screen");
      }, 500);
      renderPowerChoices();
      return;
    }

    endTurn();

  } else  {

    drawSprite(gameState.player, "idle", "player-canvas");
    endTurn();

  }
  
}

//Attacking and Defending
export function onPlayerRPSClick(event) {
  if (!event.target.classList.contains("rps-square")) return;

  if (gameState.currentTurn === "player") {
    playerAttack(event);
  } 
  else if (gameState.currentTurn === "enemy") {
    playerDefend(event);
  }
}


/* START COMBAT FUNCTION */
export function startBattle() {
  //Check for player
  if (!gameState.player) return console.error("No player selected!");

  //update round and turn
  document.getElementById('round-number').textContent = `Round: ${gameState.round}`;
  document.getElementById('turn-number').textContent = `Turn: ${gameState.turn}`;

  //Highlight current turn
  document.getElementById('player-turn').classList.add('shadow-lg');


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


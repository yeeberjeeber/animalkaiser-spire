//Combat Function js file

import { rarityPassives, randomBuff, randomEnemyBuff, buffHooks } from './data.js';
import { setupBattleScreen, updateHP, showScreen, renderPowerChoices, addBattleLog, drawSprite, renderBuffIcons, renderPassives, showDamageEffect } from './screenFactory.js';
import { onTurnStart, startRound, getRandomEnemyForRound, endTurn, gameOver} from './turnFactory.js';
import { gameState, choices } from "./app.js";
import { applyPassive, applyPowers, applyBuff } from './engine.js';

/* GAMEPLAY FUNCTIONS */

//Rolling damage each turn
function rollDamage(attacker) {
  let damage;
  
  attacker.baseCritChance = applyPowers(gameState, "modifyCritChance", attacker.baseCritChance);
  attacker.baseCritMultiplier = applyPowers(gameState, "modifyCritDmg", attacker.baseCritMultiplier);

  if (Math.random() < attacker.baseCritChance) {
    damage = attacker.dmgMax * attacker.baseCritMultiplier;
  } else {
    const roll = (Math.random() + Math.random()) / 2;
    damage = Math.floor(
      roll * (attacker.dmgMax - attacker.dmgMin + 1)
    ) + attacker.dmgMin;
  }
  return damage;
} 

export function rollBuff() {
  const buff = [...randomBuff].sort(() => Math.random() - 0.5).at(0);
  const buffList = [...buffHooks];

  console.log(buff);
  gameState.player.randomBuffs.push(buff);
  addBattleLog(`Buff ${buff.name} applied!`);

  buffList.forEach(element => {
    if (element.name === buff.name) {
      addBattleLog(element.hook);
      gameState.playerBuff = element.hook;
    }
  });
}

export function rollEnemyBuff() {
  const buff = [...randomEnemyBuff].sort(() => Math.random() - 0.5).at(0);
  const buffList = [...buffHooks];

  console.log(buff);
  gameState.enemy.randomBuffs.push(buff);
  addBattleLog(`Enemy Buff ${buff.name} applied!`);

  buffList.forEach(element => {
    if (element.name === buff.name) {
      addBattleLog(element.hook);
      gameState.enemyBuff = element.hook;
    }
  });
}

export function setEnemyBuff(entity) {
  gameState.enemyBuff = null;
  rollEnemyBuff();
  if (gameState.enemyBuff === "modifyCritChance") {
    applyBuff(gameState.enemy, gameState.enemyBuff, entity.baseCritChance);
  } else if (gameState.enemyBuff === "modifyCritDmg" ) {
    applyBuff(gameState.enemy, gameState.enemyBuff, entity.baseCritMultiplier);
  } else {
    applyBuff(gameState.enemy, gameState.enemyBuff, gameState.enemyCurrentDmg);
  }
  
}

/* ROCK PAPER SCISSORS FUNCTIONS */
function rollEnemyRPS() {
  return choices[Math.floor(Math.random() * choices.length)];
} 

//Playing the animation for enemy roll
function animateEnemyChoice(duration = 1000, interval = 100, callback) {
  let elapsed = 0;
  const rollInterval = setInterval(() => {
    // Pick a temporary random choice to show
    const tempChoice = choices[Math.floor(Math.random() * choices.length)];
    gameState.enemyRPS = tempChoice;
    updateRPSUI();

    elapsed += interval;
    if (elapsed >= duration) {
      clearInterval(rollInterval);

      // After rolling, pick final choice (can be random or strategic)
      gameState.enemyRPS = rollEnemyRPS();
      updateRPSUI();

      if (callback) callback();
    }
  }, interval);
}

//Highlight the selected box
export function updateRPSUI() {

  const playerSquares = [
    document.getElementById("player-rock"),
    document.getElementById("player-paper"),
    document.getElementById("player-scissors")
  ]

  const allDisabled = playerSquares.every(div => div.classList.contains("disabled"));

  //Checks each square under rps-square class
  document.querySelectorAll(".rps-square").forEach(el => {
    el.classList.remove("selected");
    el.classList.remove("enemy-selected");

    if(el.id === `player-${gameState.playerAttackRPS}` && gameState.playerSelected === 3) {

      //apply enemy buffs
      setEnemyBuff(gameState.enemy);
      renderBuffIcons(gameState.enemy, "enemy-buffs");

      el.classList.add("disabled");
      gameState.playerSelected = 0;
    }

    if (el.id === `player-${gameState.playerAttackRPS}` && allDisabled) {
      el.classList.add("disabled");
      gameState.playerSelected = 0;

      const shuffled = [...playerSquares].sort(() => Math.random() - 0.5);

      shuffled[0].classList.remove("disabled");
      shuffled[1].classList.remove("disabled");
    } 

    //Adds a selected to the class once checked for selection match
    if (el.id === `player-${gameState.playerAttackRPS}`) {
      el.classList.add("selected");
    }

    //Enemy logic checking
    if (gameState.currentTurn === 'player' && el.id === `enemy-${gameState.enemyRPS}`) {
      el.classList.add("selected");
    } else if (gameState.currentTurn === 'enemy' && el.id === `enemy-${gameState.enemyRPS}`) {
      el.classList.add("enemy-selected");
    } else {
      return;
    }
  });
}

//Reset locks each turn
export function resetRPSUI() {
  //Checks each square under rps-square class
  document.querySelectorAll(".rps-square").forEach(el => {
    el.classList.remove("disabled");
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
      passives: rarityPassives[animal.rarity] || [], //lookup to get passive effects
      activePowers: [],
      randomBuffs: [],
      baseCritChance: 0.1,
      baseCritMultiplier: 1.5,
      sprite: animal.sprite,
      spriteOffsetX: 0
    };
}

/* ATTACK FUNCTIONS */
//Enemy attack calculation
export function enemyAttack() {

  gameState.enemyRPS = rollEnemyRPS();

  updateRPSUI();
  
  setTimeout(() => {
    drawSprite(gameState.enemy, "attack", "enemy-canvas");
    drawSprite(gameState.enemy, "idle", "enemy-canvas");
  }, 500 );
  

  console.log(gameState.enemyRPS);
}

//Calls when enemy selects RPS choice
export function playerDefend() {
  if (gameState.currentTurn !== "enemy") return;

  updateRPSUI();

  const outcome = resolveRPS(gameState.enemyRPS, gameState.playerDefendRPS);

  if(outcome === "win"){

    drawSprite(gameState.player, "hurt", "player-canvas");

    const damage = rollDamage(gameState.enemy);

    gameState.enemyCurrentDmg = damage;

    gameState.player.currentHP -= damage;
    if (gameState.player.currentHP < 0) {
      gameState.player.currentHP = 0;
    }

    addBattleLog(`${gameState.enemy.name} hits ${gameState.player.name} for ${damage} damage!`);
    updateHP();

    showDamageEffect("player-damage-container", damage);

    setTimeout(() => {
      drawSprite(gameState.player, "idle", "player-canvas");
      
    }, 300);

    if (gameState.player.currentHP <= 0) {
      addBattleLog(`${gameState.player.name} is defeated!`);
      setTimeout(() => {
        gameOver();
      }, 2000);
      return;
    }

    setTimeout(() => {
        endTurn();
      }, 500);

  } else {

    setTimeout(() => {
        endTurn();
      }, 500);

  }

}

//Player attack calculation
export function playerAttack() {

  drawSprite(gameState.player, "attack", "player-canvas");

  animateEnemyChoice(1200, 150, () => {
    console.log(gameState.playerAttackRPS);
    console.log(gameState.enemyRPS);
    console.log(`Player last selected: ${gameState.playerLastRPS}`);
  
    const outcome = resolveRPS(gameState.playerAttackRPS, gameState.enemyRPS);

    if (outcome === "win") {

      drawSprite(gameState.enemy, "hurt", "enemy-canvas");

      let damage = rollDamage(gameState.player);

      console.log(gameState.playerBuff);

      damage = applyBuff(gameState.player, gameState.playerBuff, damage);

      // Bronze & Silver passive
      damage = applyPassive(gameState.player, "onAttack", damage);

      // Gold passive
      damage = applyPassive(gameState.player, "onFirstAttack", damage, gameState);

      //Apply damage power if any
      damage = applyPowers(gameState.player, "onAttack", damage);

      gameState.enemy.currentHP -= damage;
      if (gameState.enemy.currentHP < 0) gameState.enemy.currentHP = 0;

      addBattleLog(`${gameState.player.name} hits ${gameState.enemy.name} for ${damage} damage!`);
      updateHP();

      showDamageEffect("enemy-damage-container", damage);

      setTimeout(() => {
        drawSprite(gameState.player, "idle", "player-canvas");
        drawSprite(gameState.enemy, "idle", "enemy-canvas");
      }, 300);

      if (gameState.enemy.currentHP <= 0 && gameState.round < gameState.maxRounds) {

        addBattleLog(`${gameState.enemy.name} is defeated!`);
        setTimeout(() => {
          showScreen("power-selection-screen");
        }, 2000);
        renderPowerChoices();
        return;

      } else if (gameState.enemy.currentHP <= 0 && gameState.round > gameState.maxRounds) {
 
        setTimeout(() => {
          addBattleLog("Congratulations! You completed the game!");
          showScreen("victory-screen");
        }, 2000);
        return;

      }

      setTimeout(() => {
        endTurn();
      }, 500);
    
    } else  {
      drawSprite(gameState.player, "idle", "player-canvas");
      setTimeout(() => {
        endTurn();
      }, 500);
    }
  });
}

//Attacking and Defending
export function onPlayerRPSClick(event) {
  if (!event.target.classList.contains("rps-square")) return;

  if (gameState.currentTurn === "player") {

    gameState.playerAttackRPS = event.target.id.replace("player-", "");

    //Increase count of same selection
    if (gameState.playerAttackRPS === gameState.playerLastRPS) {
      gameState.playerSelected += 1;
      console.log(gameState.playerSelected);
    }

    playerAttack();
  } 
  else if (gameState.currentTurn === "enemy") {

    gameState.playerDefendRPS = event.target.id.replace("player-", "");

    playerDefend();
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
  console.log(gameState.player.passives);
  renderPassives(gameState.player, "player-buffs");
  renderBuffIcons(gameState.player, "player-buffs");

  //Clear battle log
  document.getElementById("battle-log").textContent = "";

  onTurnStart();
  startRound();
}


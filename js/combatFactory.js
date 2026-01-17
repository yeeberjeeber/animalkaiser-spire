//Function js file

import { animals, rarityPassives, enemies } from './data.js';
import { setupBattleScreen } from './screenFactory.js';


/* GAMEPLAY FUNCTIONS */

//Rolling damage each turn
function rollDamage(attacker) {
  if (Math.random() < 0.1) {
    return attacker.dmgMax; // crit hit
  }

  const roll = (Math.random() + Math.random()) / 2;
  return Math.floor(
    roll * (attacker.dmgMax - attacker.dmgMin + 1)
  ) + attacker.dmgMin;
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

//Creating the enemy for each round
function getRandomEnemyForRound(round) {
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

//Attack Phase
export function attack(attacker, defender) {
  const damage = rollDamage(attacker);
  defender.currentHP -= damage;
  console.log(`${attacker.name} hits ${defender.name} for ${damage} damage!`);
}

//Starting the Battle
export function startBattle() {
  // Check for player
  if (!gameState.player) return console.error("No player selected!");
  
  // Picking a random enemy
  gameState.enemy = getRandomEnemyForRound(gameState.round || 1);
  gameState.enemy.currentHP = gameState.enemy.maxHP; // full HP

  setupBattleScreen();

  const attackBtn = document.getElementById("attack-btn");
  const specialBtn = document.getElementById("special-btn");

  attackBtn.onclick = () => playerAttack();
  specialBtn.onclick = () => playerSpecial();

  // Optional: clear battle log
  document.getElementById("battle-log").textContent = "";
}


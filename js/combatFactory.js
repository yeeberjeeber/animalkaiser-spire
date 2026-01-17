//Function js file

import { animals, rarityPassives, enemies } from './animalData.js';


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

//Attack Phase
export function attack(attacker, defender) {
  const damage = rollDamage(attacker);
  defender.currentHP -= damage;
  console.log(`${attacker.name} hits ${defender.name} for ${damage} damage!`);
}




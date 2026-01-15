import { animals, rarityPassives, enemies } from './animal.js';

//Rolling damage each turn
function rollDamage(attacker) {
  return Math.floor(Math.random() * (attacker.dmgMax - attacker.dmgMin + 1)) + attacker.dmgMin;
}

export function createPlayer(animal) {
    return {
        ...animal,
        currentHP: animals.maxHP,
        passives: rarityPassives[animals.rarity],
        enhancements: []
    };
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
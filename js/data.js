export const animals = [
    {id: 1, name: "Lion", maxHP: 120, dmgMin: 22, dmgMax: 25, rarity: "Gold"},
    {id: 2, name: "Bald Eagle", maxHP: 90, dmgMin: 23, dmgMax: 30, rarity: "Gold"},
    {id: 3, name: "Great White Shark", maxHP: 110, dmgMin: 20, dmgMax: 27, rarity: "Gold"},
    {id: 4, name: "Bengal Tiger", maxHP: 120, dmgMin: 21, dmgMax: 26, rarity: "Gold"},
    {id: 5, name: "Polar Bear", maxHP: 140, dmgMin: 13, dmgMax: 19, rarity: "Silver"},
    {id: 6, name: "Indian Cobra", maxHP: 100, dmgMin: 14, dmgMax: 21, rarity: "Silver"},
    {id: 7, name: "Indian Elephant", maxHP: 150, dmgMin: 11, dmgMax: 20, rarity: "Silver"},
    {id: 8, name: "Gray Wolf", maxHP: 80, dmgMin: 15, dmgMax: 22, rarity: "Bronze"},
    {id: 9, name: "Panda", maxHP: 100, dmgMin: 13, dmgMax: 18, rarity: "Bronze"},
    {id: 10, name: "Nile Crocodile", maxHP: 100, dmgMin: 17, dmgMax: 22, rarity: "Bronze"},
    {id: 11, name: "Brown Bear", maxHP: 100, dmgMin: 10, dmgMax: 20, rarity: "Common"},
    {id: 12, name: "Cheetah", maxHP: 70, dmgMin: 12, dmgMax: 19, rarity: "Common"},
    {id: 13, name: "Black Panther", maxHP: 70, dmgMin: 15, dmgMax: 19, rarity: "Common"},
    {id: 14, name: "Peregrine Falcon", maxHP: 50, dmgMin: 12, dmgMax: 19, rarity: "Common"},
    {id: 15, name: "Manta Ray", maxHP: 60, dmgMin: 15, dmgMax: 19, rarity: "Common"}
]

export const rarityPassives = {
  Common: {
    description: "Heal 15 HP at the start of each turn",
    onTurnStart(player) {
      player.currentHP = Math.min(
        player.currentHP + 15,
        player.maxHP
      );
    }
  },
  Bronze: {
    description: "Damage rolls are more consistent",
    onAttack(attacker, damage) {
      const avg = (attacker.dmgMin + attacker.dmgMax) / 2;
      return Math.round((damage + avg) / 2);
    }
  },
  Silver: {
    description: "10% chance to deal +5 damage",
    onAttack(attacker, damage) {
      if (Math.random() < 0.1) {
        return damage + 5;
      }
      return damage;
    }
  },
  Gold: {
    description: "First attack each round deals +10 damage",
    onFirstAttack(attacker, damage, gameState) {
      if (!gameState.firstAttackUsed) {
        gameState.firstAttackUsed = true;
        return damage + 10;
      }
      console.log(damage);
      return damage;
    }
  }
}


export const enemies = [
  { id: 1, name: "Wild Boar", maxHP: 100, dmgMin: 11, dmgMax: 15, difficulty: "Easy"},
  { id: 2, name: "Grizzly Bear", maxHP: 110, dmgMin: 14, dmgMax: 20, difficulty: "Easy"},
  { id: 3, name: "Snow Leopard", maxHP: 90, dmgMin: 12, dmgMax: 18, difficulty: "Easy" },
  { id: 4, name: "Trickster Fox", maxHP: 70, dmgMin: 8, dmgMax: 38, difficulty: "Medium" },
  { id: 5, name: "Crocodile", maxHP: 100, dmgMin: 19, dmgMax: 25, difficulty: "Medium" },
  { id: 6, name: "Raptor", maxHP: 90, dmgMin: 24, dmgMax: 32, difficulty: "Hard" },
  { id: 7, name: "Elephant Calf", maxHP: 140, dmgMin: 30, dmgMax: 48, difficulty: "Hard" },
  { id: 8, name: "Siegfried", maxHP: 500, dmgMin: 48, dmgMax: 98, difficulty: "Boss" }
]
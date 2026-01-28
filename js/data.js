import { gameState } from "./app.js";
import { addBattleLog } from "./screenFactory.js";

export const animals = [
    {
      id: 1, 
      name: "Lion", 
      maxHP: 120, 
      dmgMin: 22, 
      dmgMax: 25, 
      rarity: "Gold", 
      sprite: {
        sheet: "./sprites/player/lion.png",  
        frameWidth: 42, 
        frameHeight: 36, 
        animations: {
          idle: { frames: 1, row: 2, col: 1, speed: 500 },
          attack: { frames: 1, row: 2, col: 2, speed: 500 },
          hurt: { frames: 1, row: 2, col: 0, speed: 500 }
        }
      }
    },      
    {
      id: 2, 
      name: "Vulture", 
      maxHP: 90, 
      dmgMin: 23, 
      dmgMax: 30, 
      rarity: "Gold",
      sprite: {
        sheet: "./sprites/player/vulture_fly.png",
        frameWidth: 42, 
        frameHeight: 36,
        animations: {
          idle: { frames: 1, row: 2, col: 1, speed: 500 },
          attack: { frames: 1, row: 2, col: 2, speed: 500 },
          hurt: { frames: 1, row: 2, col: 0, speed: 500 }
        }
      }
    },
    {
      id: 3, 
      name: "Great White Shark", 
      maxHP: 110, 
      dmgMin: 20, 
      dmgMax: 27, 
      rarity: "Gold",
      sprite: {
        sheet: "./sprites/player/shark_full_blue_1.png",
        frameWidth: 64, 
        frameHeight: 48,
        animations: {
          idle: { frames: 1, row: 2, col: 1, speed: 500 },
          attack: { frames: 1, row: 2, col: 2, speed: 500 },
          hurt: { frames: 1, row: 2, col: 0, speed: 500 }
        }
      }
    },
    {
      id: 4, 
      name: "Bengal Tiger", 
      maxHP: 120, 
      dmgMin: 21, 
      dmgMax: 26, 
      rarity: "Gold",
      sprite: {
        sheet: "./sprites/player/tiger.png",
        frameWidth: 42, 
        frameHeight: 36,
        animations: {
          idle: { frames: 1, row: 2, col: 1, speed: 500 },
          attack: { frames: 1, row: 2, col: 2, speed: 500 },
          hurt: { frames: 1, row: 2, col: 0, speed: 500 }
        }
      }
    },
    {
      id: 5, 
      name: "Bison", 
      maxHP: 140, 
      dmgMin: 13, 
      dmgMax: 19, 
      rarity: "Silver",
      sprite: {
        sheet: "./sprites/player/bison.png",
        frameWidth: 52, 
        frameHeight: 53,
        animations: {
          idle: { frames: 1, row: 2, col: 1, speed: 500 },
          attack: { frames: 1, row: 2, col: 2, speed: 500 },
          hurt: { frames: 1, row: 2, col: 0, speed: 500 }
        }
      }
    },
    {
      id: 6, 
      name: "Walrus", 
      maxHP: 100, 
      dmgMin: 14, 
      dmgMax: 21, 
      rarity: "Silver",
      sprite: {
        sheet: "./sprites/player/walrus.png",
        frameWidth: 42, 
        frameHeight: 36,
        animations: {
          idle: { frames: 1, row: 2, col: 1, speed: 500 },
          attack: { frames: 1, row: 2, col: 2, speed: 500 },
          hurt: { frames: 1, row: 2, col: 0, speed: 500 }
        }
      }
    },
    {
      id: 7, 
      name: "Indian Elephant", 
      maxHP: 150, 
      dmgMin: 11, 
      dmgMax: 20, 
      rarity: "Silver",
      sprite: {
        sheet: "./sprites/player/elephant.png",
        frameWidth: 52, 
        frameHeight: 53,
        animations: {
          idle: { frames: 1, row: 2, col: 1, speed: 500 },
          attack: { frames: 1, row: 2, col: 2, speed: 500 },
          hurt: { frames: 1, row: 2, col: 0, speed: 500 }
        }
      }
    },
    {
      id: 8, 
      name: "Kangaroo", 
      maxHP: 80, 
      dmgMin: 15, 
      dmgMax: 22, 
      rarity: "Bronze",
      sprite: {
        sheet: "./sprites/player/kangaroo.png",
        frameWidth: 52, 
        frameHeight: 53,
        animations: {
          idle: { frames: 1, row: 2, col: 1, speed: 500 },
          attack: { frames: 1, row: 2, col: 2, speed: 500 },
          hurt: { frames: 1, row: 2, col: 0, speed: 500 }
        }
      }
    },
    {
      id: 9, 
      name: "Hippopotamus", 
      maxHP: 100, 
      dmgMin: 13, 
      dmgMax: 18, 
      rarity: "Bronze",
      sprite: {
        sheet: "./sprites/player/hippo.png",
        frameWidth: 52, 
        frameHeight: 53,
        animations: {
          idle: { frames: 1, row: 2, col: 1, speed: 500 },
          attack: { frames: 1, row: 2, col: 2, speed: 500 },
          hurt: { frames: 1, row: 2, col: 0, speed: 500 }
        }
      }
    },
    {
      id: 10, 
      name: "Nile Crocodile", 
      maxHP: 100, 
      dmgMin: 17, 
      dmgMax: 22, 
      rarity: "Bronze",
      sprite: {
        sheet: "./sprites/player/crocodile.png",
        frameWidth: 76, 
        frameHeight: 53,
        animations: {
          idle: { frames: 1, row: 2, col: 1, speed: 500 },
          attack: { frames: 1, row: 2, col: 2, speed: 500 },
          hurt: { frames: 1, row: 2, col: 0, speed: 500 }
        }
      }
    },
    {
      id: 11, 
      name: "Camel", 
      maxHP: 100, 
      dmgMin: 10, 
      dmgMax: 20, 
      rarity: "Common",
      sprite: {
        sheet: "./sprites/player/camel_b.png",
        frameWidth: 52, 
        frameHeight: 53,
        animations: {
          idle: { frames: 1, row: 2, col: 1, speed: 500 },
          attack: { frames: 1, row: 2, col: 2, speed: 500 },
          hurt: { frames: 1, row: 2, col: 0, speed: 500 }
        }
      }
    },
    {
      id: 12, 
      name: "Horseshoe Crab", 
      maxHP: 70, 
      dmgMin: 12, 
      dmgMax: 19, 
      rarity: "Common",
      sprite: {
        sheet: "./sprites/player/horseshoe_crab.png",
        frameWidth: 42, 
        frameHeight: 36,
        animations: {
          idle: { frames: 1, row: 2, col: 1, speed: 500 },
          attack: { frames: 1, row: 2, col: 2, speed: 500 },
          hurt: { frames: 1, row: 2, col: 0, speed: 500 }
        }
      }
    },
    {
      id: 13, 
      name: "Black Panther", 
      maxHP: 70, 
      dmgMin: 15, 
      dmgMax: 19, 
      rarity: "Common",
      sprite: {
        sheet: "./sprites/player/panther.png",
        frameWidth: 42, 
        frameHeight: 36,
        animations: {
          idle: { frames: 1, row: 2, col: 1, speed: 500 },
          attack: { frames: 1, row: 2, col: 2, speed: 500 },
          hurt: { frames: 1, row: 2, col: 0, speed: 500 }
        }
      }
    },
    {
      id: 14, 
      name: "Zebra", 
      maxHP: 50, 
      dmgMin: 12, 
      dmgMax: 19, 
      rarity: "Common",
      sprite: {
        sheet: "./sprites/player/zebra.png",
        frameWidth: 52, 
        frameHeight: 53,
        animations: {
          idle: { frames: 1, row: 2, col: 1, speed: 500 },
          attack: { frames: 1, row: 2, col: 2, speed: 500 },
          hurt: { frames: 1, row: 2, col: 0, speed: 500 }
        }
      }
    },
    {
      id: 15, 
      name: "Stingray", 
      maxHP: 60, 
      dmgMin: 15, 
      dmgMax: 19, 
      rarity: "Common",
      sprite: {
        sheet: "./sprites/player/ray.png",
        frameWidth: 42, 
        frameHeight: 36,
        animations: {
          idle: { frames: 1, row: 2, col: 1, speed: 500 },
          attack: { frames: 1, row: 2, col: 2, speed: 500 },
          hurt: { frames: 1, row: 2, col: 0, speed: 500 }
        }
      }
    }
]

export const buffHooks = [
  {
    id: 1,
    name: "Increase Damage",
    hook: "onAttack"
  },
  {
    id: 2,
    name: "Rock Aggressor",
    hook: "onRockAttack"
  },
  {
    id: 3,
    name: "Paper Aggressor",
    hook: "onPaperAttack"
  },
  {
    id: 4,
    name: "Scissors Aggressor",
    hook: "onScissorsAttack"
  },
  {
    id: 5,
    name: "Sharp Edge",
    hook: "modifyCritChance"
  },
  {
    id: 6,
    name: "Keen Edge",
    hook: "modifyCritDmg"
  }
]

export const randomEnemyBuff = [
  { 
    id: 1,
    name: "Increase Damage",
    description: "Increases damage by 5",
    type: "attack",
    color: "#800000",
    onAttack(player, damage) {
      return damage + 5;
    }
  },
  {
    id: 2,
    name: "Rock Aggressor",
    description: "Rock deals more damage this round",
    type: "attack",
    color: "#800000",
    onRockAttack(player, damage) {
      if (gameState.enemyRPS === "rock"){
        return damage + 5;
      }
    }
  },
  {
    id: 3,
    name: "Scissors Aggressor",
    description: "Scissors deals more damage this round",
    type: "attack",
    color: "#800000",
    onScissorsAttack(player, damage) {
      if (gameState.enemyRPS === "scissors"){
        return damage + 5;
      }
    }
  },
  {
    id: 4,
    name: "Paper Aggressor",
    description: "Scissors deals more damage this round",
    type: "attack",
    color: "#800000",
    onPaperAttack(player, damage) {
      if (gameState.enemyRPS === "paper"){
        return damage + 5;
      }
    }
  },
  {
    id: 5,
    name: "Sharp Edge",
    description: "Increases critical chance by 25%",
    type: "attack",
    color: "#FDDC5C",
    modifyCritChance(player, chance) {
      return chance + 0.25;
    }
  },
  {
    id: 6,
    name: "Keen Edge",
    description: "Increases critical damage by 25%",
    type: "attack",
    color: "#D3AF37",
    modifyCritDmg(player, multiplier) {
      return multiplier + 0.25;
    }
  }
]

export const randomBuff = [
  { 
    id: 1,
    name: "Increase Damage",
    description: "Increases damage by 5",
    type: "attack",
    color: "#800000",
    onAttack(player, damage) {
      return damage + 5;
    }
  },
  {
    id: 2,
    name: "Rock Aggressor",
    description: "Rock deals more damage this round",
    type: "attack",
    color: "#800000",
    onRockAttack(player, damage) {
      if (gameState.playerAttackRPS === "rock"){
        return damage + 5;
      }
    }
  },
  {
    id: 3,
    name: "Scissors Aggressor",
    description: "Scissors deals more damage this round",
    type: "attack",
    color: "#800000",
    onScissorsAttack(player, damage) {
      if (gameState.playerAttackRPS === "scissors"){
        return damage + 5;
      }
    }
  },
  {
    id: 4,
    name: "Paper Aggressor",
    description: "Scissors deals more damage this round",
    type: "attack",
    color: "#800000",
    onPaperAttack(player, damage) {
      if (gameState.playerAttackRPS === "paper"){
        return damage + 5;
      }
    }
  }
]

export const rarityPassives = {
  Common: {
    description: "Heal 7 HP at the start of each turn",
    color: "#fff",
    onTurnStart(player) {
      player.currentHP = Math.min(player.currentHP + 7, player.maxHP);
      addBattleLog("Player heals 7 HP!");
    }
  },
  Bronze: {
    description: "Damage rolls are more consistent",
    color: "#CD7F32",
    onAttack(attacker, damage) {
      const avg = (attacker.dmgMin + attacker.dmgMax) / 2;
      return Math.round((damage + avg) / 2);
    }
  },
  Silver: {
    description: "70% chance to deal +5 damage",
    color: "#C0C0C0",
    onAttack(attacker, damage) {
      if (Math.random() < 0.7) {
        return damage + 5;
      }
      return damage;
    }
  },
  Gold: {
    description: "First attack each round deals +10 damage",
    color: "#FFD700",
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


export const powerCards = [
  {
    id: 1,
    name: "Increase Damage",
    description: "Increases damage by 5",
    type: "attack",
    color: "#ff0000",
    onAttack(player, damage) {
      return damage + 5;
    }
  },
  {
    id: 2,
    name: "Healing Wind",
    description: "Healed HP by 20 points",
    type: "heal",
    color: "#008000",
    onRoundStart(player) {
      player.currentHP = Math.min(player.currentHP + 20, player.maxHP);
      addBattleLog("Healing Wind heals 20 HP!");
    }
  },
  {
    id: 3,
    name: "Sharp Edge",
    description: "Increases critical chance by 25%",
    type: "attack",
    color: "#FDDC5C",
    modifyCritChance(player, chance) {
      return chance + 0.25;
    }
  },
  {
    id: 4,
    name: "Keen Edge",
    description: "Increases critical damage by 25%",
    type: "attack",
    color: "#D3AF37",
    modifyCritDmg(player, multiplier) {
      return multiplier + 0.25;
    }
  }
]


export const enemies = [
  { 
    id: 1, 
    name: "Pufferfish", 
    maxHP: 60, 
    dmgMin: 11, 
    dmgMax: 15, 
    difficulty: "Easy",
    sprite: {
      sheet: "./sprites/enemy/pufferfish_big.png",
        frameWidth: 42, 
        frameHeight: 36,
        animations: {
          idle: { frames: 1, row: 2, col: 1, speed: 500 },
          attack: { frames: 1, row: 2, col: 2, speed: 500 },
          hurt: { frames: 1, row: 2, col: 0, speed: 500 }
        }
    }
  },
  { 
    id: 2, 
    name: "Owl", 
    maxHP: 90, 
    dmgMin: 12, 
    dmgMax: 18, 
    difficulty: "Easy",
    sprite: {
      sheet: "./sprites/enemy/owl_fly.png",
        frameWidth: 42, 
        frameHeight: 36,
        animations: {
          idle: { frames: 1, row: 1, col: 1, speed: 500 },
          attack: { frames: 1, row: 1, col: 2, speed: 500 },
          hurt: { frames: 1, row: 1, col: 0, speed: 500 }
        }
    }
  },
  { 
    id: 3, 
    name: "Sea Turtle", 
    maxHP: 120, 
    dmgMin: 10, 
    dmgMax: 14, 
    difficulty: "Easy",
    sprite: {
      sheet: "./sprites/enemy/seaturtle.png",
        frameWidth: 42, 
        frameHeight: 36,
        animations: {
          idle: { frames: 1, row: 2, col: 1, speed: 500 },
          attack: { frames: 1, row: 2, col: 2, speed: 500 },
          hurt: { frames: 1, row: 2, col: 0, speed: 500 }
        }
    }
  },
  { 
    id: 4, 
    name: "Rhinoceros", 
    maxHP: 70, 
    dmgMin: 8, 
    dmgMax: 38, 
    difficulty: "Medium",
    sprite: {
      sheet: "./sprites/enemy/rhinoceros.png",
        frameWidth: 52, 
        frameHeight: 53,
        animations: {
          idle: { frames: 1, row: 1, col: 1, speed: 500 },
          attack: { frames: 1, row: 1, col: 2, speed: 500 },
          hurt: { frames: 1, row: 1, col: 0, speed: 500 }
        }
    }
  },
  { 
    id: 5, 
    name: "Sabretooth Tiger", 
    maxHP: 100, 
    dmgMin: 19, 
    dmgMax: 25, 
    difficulty: "Medium",
    sprite: {
      sheet: "./sprites/enemy/sabretooth.png",
        frameWidth: 42, 
        frameHeight: 36,
        animations: {
          idle: { frames: 1, row: 1, col: 1, speed: 500 },
          attack: { frames: 1, row: 1, col: 2, speed: 500 },
          hurt: { frames: 1, row: 1, col: 0, speed: 500 }
        }
    }
  },
  { 
    id: 6, 
    name: "Gorilla", 
    maxHP: 90, 
    dmgMin: 24, 
    dmgMax: 32, 
    difficulty: "Hard",
    sprite: {
      sheet: "./sprites/enemy/gorilla.png",
        frameWidth: 42, 
        frameHeight: 36,
        animations: {
          idle: { frames: 1, row: 1, col: 1, speed: 500 },
          attack: { frames: 1, row: 1, col: 2, speed: 500 },
          hurt: { frames: 1, row: 1, col: 0, speed: 500 }
        }
    }
  },
  { 
    id: 7, 
    name: "Elephant Calf", 
    maxHP: 140, 
    dmgMin: 30, 
    dmgMax: 48, 
    difficulty: "Hard",
    sprite: {
      sheet: "./sprites/enemy/elephant_baby.png",
        frameWidth: 52, 
        frameHeight: 53,
        animations: {
          idle: { frames: 1, row: 1, col: 1, speed: 500 },
          attack: { frames: 1, row: 1, col: 2, speed: 500 },
          hurt: { frames: 1, row: 1, col: 0, speed: 500 }
        }
    }
  },
  { 
    id: 8, 
    name: "Siegfried", 
    maxHP: 500, 
    dmgMin: 48, 
    dmgMax: 98, 
    difficulty: "Boss",
    sprite: {
      sheet: "./sprites/enemy/mammoth.png",
        frameWidth: 52, 
        frameHeight: 53,
        animations: {
          idle: { frames: 1, row: 1, col: 1, speed: 500 },
          attack: { frames: 1, row: 1, col: 2, speed: 500 },
          hurt: { frames: 1, row: 1, col: 0, speed: 500 }
        }
    }
  }
]
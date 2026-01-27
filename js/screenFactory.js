import { animals, powerCards } from "./data.js";
import { startBattle, createPlayer} from "./combatFactory.js";
import { getRandomEnemyForRound, endRound } from "./turnFactory.js";
import { gameState } from "./app.js";

const screens = document.querySelectorAll(".screen");

/* SCREEN FUNCTIONS */

//Changing screens, keep hidden if moving to next screen
export function showScreen(screenId) {
  screens.forEach(screen => {
    screen.classList.add("d-none");
  });

  document.getElementById(screenId).classList.remove("d-none");
}


//Generating 3 Animal cards to choose
export function renderAnimalChoices() {
  const container = document.getElementById("animal-options");
  container.innerHTML = "";

  // Randomly pick 3 animals
  const choices = [...animals].sort(() => Math.random() - 0.5).slice(0, 3);

  // ---- ANIMAL CARD CREATION WITH BOOTSTRAP ----
  const row = document.createElement("div");
  row.classList.add("row", "justify-content-center", "g-3"); 

  choices.forEach(animal => {
    const col = document.createElement("div");
    col.classList.add("col-12", "col-md-4"); 

    const card = document.createElement("div");
    card.classList.add("card", "text-center", "animal-card", animal.rarity.toLowerCase());
    card.style.height = "300px";

    card.innerHTML = `
      <div class="card-body">
        <h5 class="card-title">${animal.name}</h5>
        <p class="card-text">HP: ${animal.maxHP}</p>
        <p class="card-text">Damage: ${animal.dmgMin}-${animal.dmgMax}</p>
        <p class="card-text">Rarity: ${animal.rarity}</p>
      </div>
    `;

    card.addEventListener("click", () => {
      gameState.player = createPlayer(animal);
      console.log(gameState.player);
      showScreen("battle-screen");
      startBattle();
    });

    col.appendChild(card);
    row.appendChild(col);
  });

  container.appendChild(row);
}


export function setupBattleScreen() {
  gameState.enemy = getRandomEnemyForRound(gameState.round);

  const player = gameState.player;
  const enemy = gameState.enemy;

  // Set names
  document.getElementById("player-name").textContent = player.name;
  document.getElementById("enemy-name").textContent = enemy.name;

  // Initialize HP bars
  updateHP();

  drawSprite(gameState.player, "idle", "player-canvas");
  drawSprite(gameState.enemy, "idle", "enemy-canvas");
}


export function updateHP() {
  const player = gameState.player;
  const enemy = gameState.enemy;

  // Make sure both exist
  if (!player || !enemy) return;

  const playerHPPercent = (player.currentHP / player.maxHP) * 100;
  const enemyHPPercent = (enemy.currentHP / enemy.maxHP) * 100;

  document.getElementById("player-hp-bar").style.width = playerHPPercent + "%";
  document.getElementById("player-hp-text").textContent =
    `HP: ${player.currentHP} / ${player.maxHP}`;

  document.getElementById("enemy-hp-bar").style.width = enemyHPPercent + "%";
  document.getElementById("enemy-hp-text").textContent =
    `HP: ${enemy.currentHP} / ${enemy.maxHP}`;
}


export function renderPowerChoices() {
  const container = document.getElementById("power-options");
  container.innerHTML = ""; // Clear previous cards

  // Randomly pick 3 power cards to display
  const choices = [...powerCards].sort(() => Math.random() - 0.5).slice(0, 3);

  choices.forEach(power => {
    const col = document.createElement("div");
    col.className = "col-md-4 mb-3"; // 3 cards per row with spacing

    // Create the card
    const card = document.createElement("div");
    card.className = "card text-center shadow";
    card.style.height = "300px";
    

    // Background color based on type
    if (power.type === "attack") card.classList.add("bg-danger", "text-white");
    else if (power.type === "heal") card.classList.add("bg-success", "text-white");
    else card.classList.add("bg-primary", "text-white"); // default

    card.style.cursor = "pointer"; 

    card.innerHTML = `
      <div class="card-body">
        <h5 class="card-title">${power.name}</h5>
        <p class="card-text">${power.description}</p>
      </div>
    `;

    //Hover effect
    card.addEventListener("mouseenter", () => card.classList.add("shadow-lg"));
    card.addEventListener("mouseleave", () => card.classList.remove("shadow-lg"));

    //Click action
    card.addEventListener("click", () => {
      gameState.player.activePowers.push(power);
      renderBuffIcons(gameState.player, "player-buffs");
      console.log("Selected power:", power);
      showScreen("battle-screen");
      endRound();
    });

    col.appendChild(card);
    container.appendChild(col);
  });
}


export function addBattleLog(message) {
  const log = document.getElementById("battle-log");
  if (!log) return;

  // Create a new line
  const entry = document.createElement("div");
  entry.textContent = message;

  // Append to log
  log.appendChild(entry);

  // Auto-scroll to bottom
  log.scrollTop = log.scrollHeight;
}

export function drawSprite(entity, animationName, canvasId) {
  const canvas = document.getElementById(canvasId);
  const ctx = canvas.getContext("2d");
  const sprite = entity.sprite;
  const anim = sprite.animations[animationName];

  if (!sprite || !anim) return;

  const img = new Image();
  img.src = sprite.sheet;

  img.onload = () => {
    const sx = anim.col * sprite.frameWidth; // source x
    const sy = anim.row * sprite.frameHeight; // source y
    const sw = sprite.frameWidth;
    const sh = sprite.frameHeight;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh);
  };
}

/* Modifying UI based on Turn */
export function changeFirstPlayerTurnUI() {
  document.getElementById('player-turn').classList.add('shadow-lg');
  document.getElementById('enemy-turn').classList.remove('shadow-lg');
  document.getElementById('enemy-turn').classList.remove('bg-danger');
  document.getElementById('enemy-turn').classList.add('bg-secondary');
}

export function changePlayerTurnUI() {
  document.getElementById('player-turn').classList.add('shadow-lg');
  document.getElementById('player-turn').classList.remove('bg-secondary');
  document.getElementById('player-turn').classList.add('bg-primary');
  document.getElementById('enemy-turn').classList.remove('shadow-lg');
  document.getElementById('enemy-turn').classList.remove('bg-danger');
  document.getElementById('enemy-turn').classList.add('bg-secondary');
}

export function changeEnemyTurnUI() {
  document.getElementById('enemy-turn').classList.add('shadow-lg');
  document.getElementById('enemy-turn').classList.remove('bg-secondary');
  document.getElementById('enemy-turn').classList.add('bg-danger');
  document.getElementById('player-turn').classList.remove('shadow-lg');
  document.getElementById('player-turn').classList.remove('bg-primary');
  document.getElementById('player-turn').classList.add('bg-secondary');
}

export function renderBuffIcons(entity, containerId) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";

  if (!entity) return;

  // Combine all buffs: passive + active + random
  const allBuffs = [
    ...(entity.activePowers || []),
    ...(entity.randomBuffs || [])
  ];

  allBuffs.forEach(buff => {
    if (!buff.color) return;

    const buffEl = document.createElement("div");
    buffEl.classList.add("buff-icon");
    buffEl.style.backgroundColor = buff.color;
    buffEl.title = `${buff.name} - ${buff.desciption}`;

    container.appendChild(buffEl);

    console.log(buff.color);
  });

  
}


//Enemy Thinking UI
export function showEnemyThinking() {
  document.getElementById("enemy-container").classList.add("thinking");
}

export function hideEnemyThinking() {
  document.getElementById("enemy-container").classList.remove("thinking");
}
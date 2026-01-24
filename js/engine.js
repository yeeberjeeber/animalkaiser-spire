export function applyPassive(entity, hook, value = null, context = {}) {
  //Check if gameState.player has passives
  if (!entity || !entity.passives) return value;

 //Get the function for the specific hook e.g. onAttack, onFirstAttack
  const func = entity.passives[hook];
  if (!func) return value;

  //Calling functon in rarityPassives
  return func(entity, value, context) ?? value;
}

//Power card function
export function applyPowers(entity, hook, value = null, context = {}) {
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
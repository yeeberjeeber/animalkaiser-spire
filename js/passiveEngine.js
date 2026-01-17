export function applyPassive(entity, hook, value = null, context = {}) {
  if (!entity || !entity.passives) return value;

  const fn = entity.passives[hook];
  if (!fn) return value;

  return fn(entity, value, context) ?? value;
}
import { OverworldPokemon } from "../../../../models/Character/OverworldPokemon/OverworldPokemon.model.js";

export const spawnOP = (position, OPConfig, chosenPokemon, map) => {
  const OP = new OverworldPokemon({
    id: chosenPokemon.id,
    tileX: position.x,
    tileY: position.y,
    sprites: OPConfig.sprites,
    facing: OPConfig.facing ?? "down",
    behavior: OPConfig.behavior,
    level: chosenPokemon.level,
    movementType: OPConfig.movementType,
  });

  OP.movementType === "fly"
    ? map.overworldPokemons.flying.push(OP)
    : map.overworldPokemons.walking.push(OP);
  return OP;
};

export const getSpawnAroundPlayer = (game, player) => {
  const map = game.mapManager.currentMap;
  const randomN = Math.floor(Math.random() * 3 + 1);

  const offsets = [
    { x: randomN, y: 0 },
    { x: -randomN, y: 0 },
    { x: 0, y: randomN },
    { x: 0, y: -randomN },
  ];

  const shuffled = offsets.sort(() => Math.random() - 0.5);

  for (const o of shuffled) {
    const x = player.tileX + o.x;
    const y = player.tileY + o.y;

    if (player.outOfMap(x, y, map)) continue;

    const tile = player.walkableTile(game, x, y);

    if (!tile.walkable) continue;
    if (!tile.encounter) continue;

    if (
      player.isEntityAt(game, x, y, (e) => e.entityType === "MO") ||
      player.isEntityAt(game, x, y, (e) => e.entityType === "NPC")
    )
      continue;

    return { x, y };
  }
};

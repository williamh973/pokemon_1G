import { OverworldPokemon } from "../../../../models/Character/OverworldPokemon/OverworldPokemon.model.js";

export const spawnOP = (OPConfig, chosenPokemon, map) => {
  const OP = new OverworldPokemon({
    id: chosenPokemon.id,
    tileX: chosenPokemon.tileX,
    tileY: chosenPokemon.tileY,
    sprites: OPConfig.sprites,
    facing: OPConfig.facing ?? "down",
    behavior: OPConfig.behavior,
    level: chosenPokemon.level,
  });
  map.overworldPokemons.push(OP);
  return OP;
};

export const getSpawnAroundPlayer = (game, player) => {
  const map = game.mapManager.currentMap;
  const offsets = [
    { x: 1, y: 0 },
    { x: -1, y: 0 },
    { x: 0, y: 1 },
    { x: 0, y: -1 },
  ];

  const shuffled = offsets.sort(() => Math.random() - 0.5);

  for (const o of shuffled) {
    const x = player.tileX + o.x;
    const y = player.tileY + o.y;

    if (player.outOfMap(x, y, map)) continue;

    const tile = player.walkableTile(game, x, y);

    if (!tile.walkable) continue;

    if (
      player.npcInFrontOfPlayer(game, x, y) ||
      player.moInFrontOfPlayer(game, x, y)
    )
      continue;

    return { x, y };
  }

  return null;
};

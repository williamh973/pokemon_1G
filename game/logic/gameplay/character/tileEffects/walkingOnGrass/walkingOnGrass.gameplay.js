import { handleCrushedTallGrass } from "./handleCrushedTallGrass.js";

export const walkingOnTallGrass = (game, character) => {
  const map = game.mapManager.currentMap;
  const x = character.tileX;
  const y = character.tileY;

  handleCrushedTallGrass(game, character, map, x, y);
};

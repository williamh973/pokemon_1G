import { CHARACTER_SPRITES } from "../../../character/sprite/characterSprite.database.js";

export const PLAYER_ABILITIES = {
  surf: false,
  fish: false,
  cut: false,
  smash: false,
  fly: false,
  teleport: false,
};

export const getSprites = (playedWith, movementType) => ({
  idle: CHARACTER_SPRITES[playedWith].world[movementType].idle,
  walk: CHARACTER_SPRITES[playedWith].world[movementType].walk,
});

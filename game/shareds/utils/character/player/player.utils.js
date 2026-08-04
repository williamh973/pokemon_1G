import { CHARACTER_SPRITES } from "../../../character/sprite/characterSprite.database.js";

export const PLAYER_ABILITIES = {
  surf: false,
  fish: false,
  cut: false,
  smash: false,
  fly: false,
  teleport: false,
};

export const getSprites = (gender, movementType) => ({
  idle: CHARACTER_SPRITES[gender].world[movementType].idle,
  walk: CHARACTER_SPRITES[gender].world[movementType].walk,
});

import { OP_SPRITES } from "../sprite/opSprite.database.js";

export const OP_DATABASE = {
  rattata: {
    sprites: {
      idle: OP_SPRITES.rattata.idle,
      walk: OP_SPRITES.rattata.walk,
    },
    behavior: "wander",
    facing: "up",
  },
  pidgey: {
    sprites: {
      idle: OP_SPRITES.pidgey.idle,
      walk: OP_SPRITES.pidgey.walk,
    },
    behavior: "wander",
    facing: "up",
  },
  zubat: {
    sprites: {
      walk: OP_SPRITES.zubat.walk,
    },
    behavior: "wander",
    facing: "up",
  },
};

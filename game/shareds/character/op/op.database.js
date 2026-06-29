import { OP_SPRITES } from "../sprite/opSprite.database.js";

export const OP_CONFIG_DATABASE = {
  rattata: {
    offsets: {
      x: 0,
      y: 0,
    },
    sprites: {
      idle: OP_SPRITES.rattata.idle,
      walk: OP_SPRITES.rattata.walk,
    },
    scale: 1,
    behavior: "wander",
    facing: "up",
    movementType: "walk",
    alwaysAnimate: true,
  },
  pidgey: {
    offsets: {
      x: 0,
      y: 0,
    },
    sprites: {
      idle: OP_SPRITES.pidgey.idle,
      walk: OP_SPRITES.pidgey.walk,
    },
    scale: 1,
    behavior: "wander",
    facing: "up",
    movementType: "walk",
    alwaysAnimate: false,
  },
  onix: {
    offsets: {
      x: 32,
      y: 64,
    },
    sprites: {
      idle: OP_SPRITES.onix.idle,
      walk: OP_SPRITES.onix.walk,
    },
    scale: 3,
    behavior: "wander",
    facing: "up",
    movementType: "walk",
    alwaysAnimate: false,
  },
  zubat: {
    offsets: {
      x: 0,
      y: 0,
    },
    sprites: {
      walk: OP_SPRITES.zubat.walk,
    },
    scale: 1,
    behavior: "wander",
    facing: "up",
    movementType: "fly",
    alwaysAnimate: true,
  },
};

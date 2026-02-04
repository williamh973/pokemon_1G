import {
  idleMfatKidight,
  idleMfatKidp,
  idlefatKidDown,
  idlefatKidLeft,
  walkDown_stepA,
  walkDown_stepB,
  walkLeft_stepA,
  walkLeft_stepB,
  walkRight_stepA,
  walkRight_stepB,
  walkUp_stepA,
  walkUp_stepB,
} from "../../../assets/images/npcs/boy/fatKid/fatKid.assets.js";
import {
  idleMomDown,
  idleMomLeft,
  idleMomRight,
  idleMomUp,
} from "../../../assets/images/npcs/girl/redMom/redMom.assets.js";

export const CHARACTER_SPRITES = {
  mom: {
    idle: {
      up: idleMomUp,
      down: idleMomDown,
      left: idleMomLeft,
      right: idleMomRight,
    },
    walk: {
      up: [idleMomUp],
      down: [idleMomDown],
      left: [idleMomLeft],
      right: [idleMomRight],
    },
  },
  fatKid: {
    idle: {
      up: idleMfatKidp,
      down: idlefatKidDown,
      left: idlefatKidLeft,
      right: idleMfatKidight,
    },
    walk: {
      up: [walkUp_stepA, walkUp_stepB],
      down: [walkDown_stepA, walkDown_stepB],
      left: [walkLeft_stepA, walkLeft_stepB],
      right: [walkRight_stepA, walkRight_stepB],
    },
  },
};

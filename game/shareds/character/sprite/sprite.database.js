import {
  idleFatKidDown,
  idleFatKidLeft,
  idleFatKidRight,
  idleFatKidUp,
  walkFatKidDown_stepA,
  walkFatKidDown_stepB,
  walkFatKidLeft_stepA,
  walkFatKidLeft_stepB,
  walkFatKidRight_stepA,
  walkFatKidRight_stepB,
  walkFatKidUp_stepA,
  walkFatKidUp_stepB,
} from "../../../assets/images/npcs/boy/fatKid/fatKid.assets.js";
import {
  idleOakDown,
  idleOakLeft,
  idleOakRight,
  idleOakUp,
  walkOakDown_stepA,
  walkOakDown_stepB,
  walkOakLeft_stepA,
  walkOakLeft_stepB,
  walkOakRight_stepA,
  walkOakRight_stepB,
  walkOakUp_stepA,
  walkOakUp_stepB,
} from "../../../assets/images/npcs/boy/oak/oak.assets.js";
import {
  idleMomDown,
  idleMomLeft,
  idleMomRight,
  idleMomUp,
} from "../../../assets/images/npcs/girl/redMom/redMom.assets.js";
import {
  idlePlayerDown,
  idlePlayerLeft,
  idlePlayerRight,
  idlePlayerUp,
  walkPlayerDown_stepA,
  walkPlayerDown_stepB,
  walkPlayerLeft_stepA,
  walkPlayerLeft_stepB,
  walkPlayerRight_stepA,
  walkPlayerRight_stepB,
  walkPlayerUp_stepA,
  walkPlayerUp_stepB,
} from "../../../assets/images/player/player.assets.js";

export const CHARACTER_SPRITES = {
  player: {
    idle: {
      up: idlePlayerUp,
      down: idlePlayerDown,
      left: idlePlayerLeft,
      right: idlePlayerRight,
    },
    walk: {
      up: [walkPlayerUp_stepA, walkPlayerUp_stepB],
      down: [walkPlayerDown_stepA, walkPlayerDown_stepB],
      left: [walkPlayerLeft_stepA, walkPlayerLeft_stepB],
      right: [walkPlayerRight_stepA, walkPlayerRight_stepB],
    },
  },
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
      up: idleFatKidUp,
      down: idleFatKidDown,
      left: idleFatKidLeft,
      right: idleFatKidRight,
    },
    walk: {
      up: [walkFatKidUp_stepA, walkFatKidUp_stepB],
      down: [walkFatKidDown_stepA, walkFatKidDown_stepB],
      left: [walkFatKidLeft_stepA, walkFatKidLeft_stepB],
      right: [walkFatKidRight_stepA, walkFatKidRight_stepB],
    },
  },
  oak: {
    idle: {
      up: idleOakUp,
      down: idleOakDown,
      left: idleOakLeft,
      right: idleOakRight,
    },
    walk: {
      up: [walkOakUp_stepA, walkOakUp_stepB],
      down: [walkOakDown_stepA, walkOakDown_stepB],
      left: [walkOakLeft_stepA, walkOakLeft_stepB],
      right: [walkOakRight_stepA, walkOakRight_stepB],
    },
  },
};

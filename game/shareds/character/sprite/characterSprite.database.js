import {
  walkBlueUp_stepA,
  walkBlueDown_stepA,
  walkBlueLeft_stepA,
  walkBlueRight_stepA,
  walkBlueUp_stepB,
  walkBlueDown_stepB,
  walkBlueLeft_stepB,
  walkBlueRight_stepB,
  idleBlueUp,
  idleBlueDown,
  idleBlueLeft,
  idleBlueRight,
} from "../../../assets/images/npcs/boy/blue/blue.assets.js";
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
  idleScientistRight,
  idleScientistUp,
  idleScientistdDown,
  idleScientistdLeft,
  walkScientistDown_stepA,
  walkScientistDown_stepB,
  walkScientistLeft_stepA,
  walkScientistLeft_stepB,
  walkScientistRight_stepA,
  walkScientistRight_stepB,
  walkScientistUp_stepA,
  walkScientistUp_stepB,
} from "../../../assets/images/npcs/boy/scientist/scientist.assets.js";
import {
  idleMGDown,
  idleMGLeft,
  idleMGRight,
  idleMGUp,
  walkMGDown_stepA,
  walkMGDown_stepB,
  walkMGLeft_stepA,
  walkMGLeft_stepB,
  walkMGRight_stepA,
  walkMGRight_stepB,
  walkMGUp_stepA,
  walkMGUp_stepB,
} from "../../../assets/images/npcs/girl/middleGirl/middleGirl.assets.js";
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
  red: {
    idle: {
      up: idlePlayerUp,
      down: idlePlayerDown,
      left: idlePlayerLeft,
      right: idlePlayerRight,
    },
    jump: {
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
  lira: {
    idle: {
      up: idlePlayerUp,
      down: idlePlayerDown,
      left: idlePlayerLeft,
      right: idlePlayerRight,
    },
    jump: {
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
  redMom: {
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
  middleGirl: {
    idle: {
      up: idleMGUp,
      down: idleMGDown,
      left: idleMGLeft,
      right: idleMGRight,
    },
    walk: {
      up: [walkMGUp_stepA, walkMGUp_stepB],
      down: [walkMGDown_stepA, walkMGDown_stepB],
      left: [walkMGLeft_stepA, walkMGLeft_stepB],
      right: [walkMGRight_stepA, walkMGRight_stepB],
    },
  },
  scientist: {
    idle: {
      up: idleScientistUp,
      down: idleScientistdDown,
      left: idleScientistdLeft,
      right: idleScientistRight,
    },
    walk: {
      up: [walkScientistUp_stepA, walkScientistUp_stepB],
      down: [walkScientistDown_stepA, walkScientistDown_stepB],
      left: [walkScientistLeft_stepA, walkScientistLeft_stepB],
      right: [walkScientistRight_stepA, walkScientistRight_stepB],
    },
  },
  blue: {
    idle: {
      up: idleBlueUp,
      down: idleBlueDown,
      left: idleBlueLeft,
      right: idleBlueRight,
    },
    walk: {
      up: [walkBlueUp_stepA, walkBlueUp_stepB],
      down: [walkBlueDown_stepA, walkBlueDown_stepB],
      left: [walkBlueLeft_stepA, walkBlueLeft_stepB],
      right: [walkBlueRight_stepA, walkBlueRight_stepB],
    },
  },
};

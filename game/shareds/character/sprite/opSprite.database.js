import {
  idlePidgeyDown,
  idlePidgeyLeft,
  idlePidgeyRight,
  idlePidgeyUp,
  walkPidgeyDown_stepA,
  walkPidgeyDown_stepB,
  walkPidgeyLeft_stepA,
  walkPidgeyLeft_stepB,
  walkPidgeyRight_stepA,
  walkPidgeyRight_stepB,
  walkPidgeyUp_stepA,
  walkPidgeyUp_stepB,
} from "../../../assets/images/pokemons/1G/overworld/pidgey/pidgey.assets.js";
import {
  idleRattataDown,
  idleRattataLeft,
  idleRattataRight,
  idleRattataUp,
  walkRattataDown_stepA,
  walkRattataDown_stepB,
  walkRattataLeft_stepA,
  walkRattataLeft_stepB,
  walkRattataRight_stepA,
  walkRattataRight_stepB,
  walkRattataUp_stepA,
  walkRattataUp_stepB,
} from "../../../assets/images/pokemons/1G/overworld/rattata/rattata.assets.js";

export const OP_SPRITES = {
  pidgey: {
    idle: {
      up: idlePidgeyUp,
      down: idlePidgeyDown,
      left: idlePidgeyLeft,
      right: idlePidgeyRight,
    },
    walk: {
      up: [walkPidgeyUp_stepA, walkPidgeyUp_stepB],
      down: [walkPidgeyDown_stepA, walkPidgeyDown_stepB],
      left: [walkPidgeyLeft_stepA, walkPidgeyLeft_stepB],
      right: [walkPidgeyRight_stepA, walkPidgeyRight_stepB],
    },
  },
  rattata: {
    idle: {
      up: idleRattataUp,
      down: idleRattataDown,
      left: idleRattataLeft,
      right: idleRattataRight,
    },
    walk: {
      up: [walkRattataUp_stepA, walkRattataUp_stepB],
      down: [walkRattataDown_stepA, walkRattataDown_stepB],
      left: [walkRattataLeft_stepA, walkRattataLeft_stepB],
      right: [walkRattataRight_stepA, walkRattataRight_stepB],
    },
  },
};

import { TURN_STATES } from "../states/turnManager.states.js";

export const handleTargetKO = (turnManager, action) => {
  if (action.target.stats.hp <= 0) {
    turnManager.koAction = {
      ...action,
      active: action.pokemon,
      fainted: action.target,
    };

    turnManager.state = TURN_STATES.DETERMINE_KO;

    console.log(`${turnManager.koAction.fainted.name} est KO`);

    return true;
  }
};

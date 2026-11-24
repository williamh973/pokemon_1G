import { TURN_STATES } from "../states/turnManager.states.js";

export const waitForAction = (turnManager, callbackFn, nextState) => {
  turnManager.state = TURN_STATES.WAITING_FOR_ACTION;
  turnManager.callbackFnAfterWait = callbackFn;
  turnManager.nextStateAfterWait = nextState;
  console.log("Jeu en attente de la validation du joueur.");
};

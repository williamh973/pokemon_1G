import { TURN_STATES } from "../states/turnManager.states.js";

export const wait = (turnManager, duration, callbackFn, nextState) => {
  turnManager.state = TURN_STATES.WAITING;
  turnManager.waitTimer = duration;
  turnManager.waitCooldown = duration;
  turnManager.callbackFnAfterWait = callbackFn;
  turnManager.nextStateAfterWait = nextState;
};

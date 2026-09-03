import { TURN_STATES } from "../states/turnManager.states.js";

export const startTurn = (turnManager, sequence) => {
  turnManager.isFinished = false;
  turnManager.koAction = null;

  turnManager.determineOrder();

  turnManager.state = TURN_STATES.FIRST_ACTION;

  turnManager.executeAction(sequence, turnManager.firstAction);
};

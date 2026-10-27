import { TURN_STATES } from "../states/turnManager.states.js";

export const startTurn = (turnManager, sequence) => {
  turnManager.isFinished = false;
  turnManager.koAction = null;

  turnManager.determineOrder();

  turnManager.isChargedMoveContinuation = [
    turnManager.firstAction,
    turnManager.secondAction,
  ].some(
    (action) =>
      action?.pokemon?.chargedMove?.animationPhase === "SECOND" &&
      action.pokemon.chargedMove.move
  );

  turnManager.state = TURN_STATES.FIRST_ACTION;

  turnManager.executeAction(sequence, turnManager.firstAction);
};

import { TURN_STATES } from "../../../states/turnManager.states.js";

export const processPendingChargedMove = (turnManager, sequence) => {
  const action = turnManager.getActionContainsChargedMove();

  if (!action) return false;

  const chargedMove = action.pokemon.chargedMove;

  if (!chargedMove.move || chargedMove.animationPhase !== "FIRST") {
    return false;
  }

  if (chargedMove.turnAction === TURN_STATES.SECOND_ACTION) {
    chargedMove.animationPhase = "SECOND";
    turnManager.state = TURN_STATES.END;
    return true;
  }

  chargedMove.animationPhase = "SECOND";

  turnManager.isExecutingChargedMove = true;
  turnManager.state = TURN_STATES.FIRST_ACTION;

  turnManager.executeAction(sequence, action);

  return true;
};

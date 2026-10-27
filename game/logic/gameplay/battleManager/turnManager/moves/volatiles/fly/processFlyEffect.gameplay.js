import { DIALOGS_DATABASE } from "../../../../../../../shareds/dialogs/dialogs.database.js";

export const processFlyEffect = (
  turnManager,
  action,
  processVolatileResult,
  sequence
) => {
  if (
    !processVolatileResult.isAffected ||
    processVolatileResult.volatile !== "FLY" ||
    action.pokemon.chargedMove.animationPhase !== "FIRST"
  )
    return false;

  action.pokemon.chargedMove.turnAction = turnManager.state;

  turnManager.battleManager.openDialogBox(
    DIALOGS_DATABASE.BATTLE_DIALOGS.takeOff(
      action.pokemon.name,
      action.pokemon.trainerId
    )
  );

  sequence.startPokemonUseMoveSequence(action);

  turnManager.waitForAction(() => {
    turnManager.onActionFinished(sequence);
  }, turnManager.state);

  return true;
};

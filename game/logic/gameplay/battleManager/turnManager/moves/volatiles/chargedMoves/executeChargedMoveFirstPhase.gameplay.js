import { handleChargedMoveDialogs } from "./handleChargedMoveDialogs.gameplay.js";

export const executeChargedMoveFirstPhase = (
  turnManager,
  action,
  processVolatileResult,
  sequence
) => {
  if (
    !processVolatileResult.isAffected ||
    processVolatileResult.volatile !== "CHARGED_MOVE" ||
    action.pokemon.chargedMove.animationPhase !== "FIRST"
  )
    return false;

  action.pokemon.chargedMove.turnAction = turnManager.state;

  const chargedMove = action.pokemon.chargedMove;
  const pokemon = action.pokemon;

  handleChargedMoveDialogs(turnManager, chargedMove, pokemon);

  sequence.startPokemonUseMoveSequence(action);

  turnManager.waitForAction(() => {
    // console.log("Le joueur a validé, onActionFinished s'éxécute");
    turnManager.onActionFinished(sequence);
  }, turnManager.state);

  return true;
};

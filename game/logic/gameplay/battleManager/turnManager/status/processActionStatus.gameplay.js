import { processPokemonStatus } from "../../../pokemon/status/processPokemonStatus.gameplay.js";
import { handlerStatusProcessDialogs } from "../handlerDialogs/status/handlerStatusProcessDialogs.gameplay.js";
import { handlerStatusRecoveryDialogs } from "../handlerDialogs/status/handlerStatusRecoveryDialogs.gameplay.js";
import { executeChargedMoveFirstPhase } from "../moves/volatiles/chargedMoves/executeChargedMoveFirstPhase.gameplay.js";
import { prepareChargedMove } from "../moves/volatiles/chargedMoves/prepareChargedMove.gameplay.js";
import { TURN_STATES } from "../states/turnManager.states.js";

export const processActionStatus = (turnManager, sequence, action) => {
  const processStatusResult = processPokemonStatus(action.pokemon);

  console.log(
    `[STATUS] ${action.pokemon.name} | ` +
      `status=${action.pokemon.status} | ` +
      `sleepTurns=${action.pokemon.sleepTurns} | ` +
      `canUseMove=${processStatusResult.canUseMove} | ` +
      `hasParalized=${processStatusResult.hasParalized} `
  );

  if (processStatusResult.hasWokenUp) {
    handlerStatusRecoveryDialogs.wokenUpProcessDialog(
      turnManager.battleManager,
      processStatusResult
    );

    turnManager.waitForAction(() => {
      turnManager.executeMove(sequence, action);
    }, turnManager.state);

    return true;
  }

  if (processStatusResult.hasThawedOut) {
    handlerStatusRecoveryDialogs.thawedOutProcessDialog(
      turnManager.battleManager,
      processStatusResult
    );

    turnManager.waitForAction(() => {
      turnManager.executeMove(sequence, action);
    }, turnManager.state);

    return true;
  }

  if (!processStatusResult.statusProcessed) return false;

  handlerStatusProcessDialogs(turnManager.battleManager, processStatusResult);

  turnManager.waitForAction(() => {
    if (processStatusResult.pokemon.stats.hp <= 0) {
      turnManager.koAction = {
        ...action,
        active: action.target,
        fainted: processStatusResult.pokemon,
      };

      turnManager.state = TURN_STATES.DETERMINE_KO;

      console.log(
        `${turnManager.koAction.fainted.name} est KO à cause de son statut`
      );

      return;
    }

    if (!processStatusResult.canUseMove) {
      turnManager.onActionFinished(sequence);
      return;
    }

    if (
      action.move?.id === "fly" &&
      action.pokemon.chargedMove.animationPhase !== "SECOND"
    ) {
      const processFlyTurnResult = prepareChargedMove(
        action.pokemon,
        action.move
      );

      console.log("processFlyTurnResult : ", processFlyTurnResult);

      if (processFlyTurnResult.isAffected) {
        return executeChargedMoveFirstPhase(
          turnManager,
          action,
          processFlyTurnResult,
          sequence
        );
      } else turnManager.executeMove(sequence, action);
    }

    turnManager.executeMove(sequence, action);
  }, turnManager.state);

  return true;
};

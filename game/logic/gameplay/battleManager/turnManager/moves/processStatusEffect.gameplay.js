import { DIALOGS_DATABASE } from "../../../../../shareds/dialogs/dialogs.database.js";
import { POKEMON_STATUS } from "../../../pokemon/status/pokemonStatus.state.js";
import { handlerStatusEffectDialogs } from "../handlerDialogs/status/handlerStatusEffectDialogs.gameplay.js";
import { applyStatusEffect } from "./applyStatusEffect.gameplay.js";

export const processStatusEffect = (turnManager, sequence, action) => {
  if (turnManager.isStatusEffectProcessed) return false;

  const statusEffectResult = applyStatusEffect(action);

  if (statusEffectResult?.isAffected) {
    turnManager.isStatusEffectProcessed = true;

    handlerStatusEffectDialogs(turnManager.battleManager, statusEffectResult);

    turnManager.waitForAction(() => {
      turnManager.checkActionAnimationFinished(sequence, action);
    }, turnManager.state);

    return true;
  }

  if (
    statusEffectResult?.reason === "ALREADY_STATUS" &&
    statusEffectResult?.pokemon.status === POKEMON_STATUS.SLEEP &&
    action.move.effect?.status === POKEMON_STATUS.SLEEP
  ) {
    turnManager.isStatusEffectProcessed = true;

    turnManager.battleManager.openDialogBox(
      DIALOGS_DATABASE.BATTLE_DIALOGS.alreadyAsleep(
        statusEffectResult.pokemon.name
      )
    );

    console.log(
      DIALOGS_DATABASE.BATTLE_DIALOGS.alreadyAsleep(
        statusEffectResult.pokemon.name
      )
    );

    turnManager.waitForAction(() => {
      turnManager.onActionFinished(sequence);
    }, turnManager.state);

    return true;
  }

  return false;
};

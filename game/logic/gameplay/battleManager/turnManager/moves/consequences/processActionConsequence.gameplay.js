import { DIALOGS_DATABASE } from "../../../../../../shareds/dialogs/dialogs.database.js";

export const processActionConsequence = (turnManager, sequence, action) => {
  if (action.pokemon.volatils.recharge) {
    turnManager.battleManager.openDialogBox(
      DIALOGS_DATABASE.BATTLE_DIALOGS.toBeExhausted(
        action.pokemon.name,
        action.pokemon.trainerId
      )
    );

    action.pokemon.volatils.recharge = false;

    turnManager.waitForAction(() => {
      turnManager.onActionFinished(sequence);
    }, turnManager.state);

    return true;
  }
};

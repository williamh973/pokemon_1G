import { DIALOGS_DATABASE } from "../../../../../../shareds/dialogs/dialogs.database.js";
import { TURN_STATES } from "../../states/turnManager.states.js";
import { processVolatileConsequence } from "./processVolatileConsequence.gameplay.js";

export const processActionVolatile = (turnManager, sequence, action) => {
  const processVolatileResult = processVolatileConsequence(action.pokemon);

  if (!processVolatileResult.isAffected) return false;

  console.log(
    `[VOLATILE] ${action.pokemon.name} | ` +
      `confusionTurns=${action.pokemon.volatils.confusionTurns} | ` +
      `canUseMove=${processVolatileResult.canUseMove}`
  );

  if (processVolatileResult.hasConfusedNoMore) {
    console.log(`N'EST PLUS CONFUS `);

    turnManager.battleManager.openDialogBox(
      DIALOGS_DATABASE.BATTLE_DIALOGS.confusedNoMore(action.pokemon.name)
    );

    turnManager.waitForAction(() => {
      turnManager.executeMove(sequence, action);
    }, turnManager.state);

    return true;
  }

  console.log(`IL EST CONFUS `);

  turnManager.battleManager.openDialogBox(
    DIALOGS_DATABASE.BATTLE_DIALOGS.confusing(action.pokemon.name)
  );

  if (processVolatileResult.isAffected && processVolatileResult.resist) {
    console.log(`CONFUS MAIS RÉSIST`);

    turnManager.waitForAction(() => {
      turnManager.executeMove(sequence, action);
    }, turnManager.state);

    return true;
  }

  if (processVolatileResult.isAffected && !processVolatileResult.resist) {
    console.log(`CONFUS, NE RÉSIST PAS`);

    turnManager.waitForAction(() => {
      turnManager.battleManager.openDialogBox(
        DIALOGS_DATABASE.BATTLE_DIALOGS.confusionDeals()
      );

      turnManager.waitForAction(() => {
        if (processVolatileResult.pokemon.stats.hp <= 0) {
          turnManager.koAction = {
            ...action,
            active: action.target,
            fainted: processVolatileResult.pokemon,
          };

          turnManager.state = TURN_STATES.DETERMINE_KO;

          console.log(
            `${turnManager.koAction.fainted.name} est KO à cause de la confusion`
          );

          return;
        }

        if (!processVolatileResult.canUseMove) {
          turnManager.onActionFinished(sequence);
          return;
        }

        turnManager.executeMove(sequence, action);
      }, turnManager.state);
    }, turnManager.state);
  }

  return true;
};

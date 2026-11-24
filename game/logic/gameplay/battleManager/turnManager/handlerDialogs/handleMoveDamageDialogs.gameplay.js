import { DIALOGS_DATABASE } from "../../../../../shareds/dialogs/dialogs.database.js";
import { processMovesEffect } from "../moves/processMovesEffect.gameplay.js";

export const handleMoveDamageDialogs = (
  turnManager,
  damageResult,
  action,
  sequence
) => {
  const { moveDamagesResult, criticalHitResult, efficiency } = damageResult;

  if (moveDamagesResult.wasHitByOHKO && efficiency !== 0) {
    turnManager.waitForAction(() => {
      processMovesEffect(
        turnManager,
        moveDamagesResult.damages,
        action,
        sequence
      );
    }, turnManager.state);

    turnManager.battleManager.openDialogBox(
      DIALOGS_DATABASE.BATTLE_DIALOGS.OHKO(
        action.target.name,
        action.target.trainerId
      )
    );

    return true;
  }

  const dialogs = [];
  const pokemon = action.pokemon;

  if (pokemon.volatils.backward) {
    dialogs.push(() => {
      turnManager.battleManager.openDialogBox(
        DIALOGS_DATABASE.BATTLE_DIALOGS.backward(
          pokemon.name,
          pokemon.trainerId
        )
      );
    });

    pokemon.volatils.backward = false;
  }

  if (criticalHitResult.isCriticalHit && efficiency !== 0) {
    dialogs.push(() => {
      turnManager.battleManager.openDialogBox(
        DIALOGS_DATABASE.BATTLE_DIALOGS.criticalHit()
      );
    });
  }

  if (efficiency < 1) {
    dialogs.push(() => {
      turnManager.battleManager.openDialogBox(
        DIALOGS_DATABASE.BATTLE_DIALOGS.notVeryEffective()
      );
    });
  } else if (efficiency > 1) {
    dialogs.push(() => {
      turnManager.battleManager.openDialogBox(
        DIALOGS_DATABASE.BATTLE_DIALOGS.superEffective()
      );
    });
  }

  if (dialogs.length === 0) return false;

  const showNextDialog = (index) => {
    dialogs[index]();

    turnManager.waitForAction(() => {
      if (index + 1 < dialogs.length) {
        showNextDialog(index + 1);
        return;
      }

      processMovesEffect(
        turnManager,
        moveDamagesResult.damages,
        action,
        sequence
      );
    }, turnManager.state);
  };

  showNextDialog(0);

  return true;
};

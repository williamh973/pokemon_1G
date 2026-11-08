import { checkDialogBoxShakeAnimation } from "../../dialogBox/dialogBoxShakeAnimation.gameplay.js";
import { deductStatHP } from "../volatiles/deductStatHP.gameplay.js";
import { calculateMoveDamages } from "./calculateDamages.gameplay.js";
import { calculateCriticalHit } from "./criticalHit/calculateCriticalHit.gameplay.js";

export const applyMoveDamage = (turnManager, action, weather) => {
  const criticalHitResult = calculateCriticalHit(action);
  const moveDamagesResult = calculateMoveDamages(
    action,
    criticalHitResult.CC,
    weather
  );

  const { TYPE1, TYPE2 } = moveDamagesResult.efficiencies;
  const efficiency = TYPE1 * TYPE2;

  if (efficiency !== 0) deductStatHP(action.target, moveDamagesResult.damages);

  turnManager.isDamageApplied = true;

  if (
    efficiency !== 0 &&
    action.target === turnManager.battleManager.currentPlayerPokemon
  )
    checkDialogBoxShakeAnimation(
      turnManager.battleManager,
      moveDamagesResult.damages
    );

  console.log(
    "moveDamagesResult : ",
    moveDamagesResult,
    "| CC : ",
    criticalHitResult.CC,
    "| isCriticalHit : ",
    criticalHitResult.isCriticalHit
  );

  return {
    moveDamagesResult,
    criticalHitResult,
    efficiency,
  };
};

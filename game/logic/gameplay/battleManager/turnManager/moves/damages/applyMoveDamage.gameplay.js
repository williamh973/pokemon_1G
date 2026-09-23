import { checkDialogBoxShakeAnimation } from "../../dialogBox/dialogBoxShakeAnimation.gameplay.js";
import { calculateMoveDamages } from "./calculateDamages.gameplay.js";
import { calculateCriticalHit } from "./criticalHit/calculateCriticalHit.gameplay.js";

export const applyMoveDamage = (turnManager, action, weather) => {
  const criticalHitResult = calculateCriticalHit(action);
  const calculResult = calculateMoveDamages(
    action,
    criticalHitResult.CC,
    weather
  );

  action.target.stats.hp = Math.max(
    0,
    action.target.stats.hp - calculResult.damages
  );

  turnManager.isDamageApplied = true;

  if (action.target === turnManager.battleManager.currentPlayerPokemon)
    checkDialogBoxShakeAnimation(
      turnManager.battleManager,
      calculResult.damages
    );

  console.log(
    "calculResult : ",
    calculResult,
    "| CC : ",
    criticalHitResult.CC,
    "| isCriticalHit : ",
    criticalHitResult.isCriticalHit
  );

  return {
    calculResult,
    criticalHitResult,
  };
};

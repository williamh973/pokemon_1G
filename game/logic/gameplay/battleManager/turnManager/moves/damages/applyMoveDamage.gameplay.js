import { checkDialogBoxShakeAnimation } from "../../dialogBox/dialogBoxShakeAnimation.gameplay.js";
import { calculateMoveDamages } from "./calculateDamages.gameplay.js";
import { calculateCriticalHit } from "./criticalHit/calculateCriticalHit.gameplay.js";

export const applyMoveDamage = (turnManager, action) => {
  const damages = calculateMoveDamages(action);

  const criticalHitResult = calculateCriticalHit(damages, action);

  action.target.stats.hp = Math.max(
    0,
    action.target.stats.hp - criticalHitResult.damages
  );

  turnManager.isDamageApplied = true;

  if (action.target === turnManager.battleManager.currentPlayerPokemon)
    checkDialogBoxShakeAnimation(turnManager.battleManager, damages);

  return { criticalHitResult: criticalHitResult };
};

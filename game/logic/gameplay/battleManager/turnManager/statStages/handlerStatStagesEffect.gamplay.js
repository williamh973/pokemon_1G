import { modifyStatStage } from "./modifyStatStage.gameplay.js";

export const handlerStatStagesEffect = (effect, action) => {
  const target = action.move.selfTarget ? action.pokemon : action.target;
  const stats = effect.stats ?? [effect.stat];
  const results = stats.map((stat) =>
    modifyStatStage(target, stat, effect.amount)
  );

  return effect.stats ? results : results[0];
};

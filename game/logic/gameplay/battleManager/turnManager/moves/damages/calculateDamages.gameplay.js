import { calculateBasicDamage } from "./basical/formulas/calculateBasicDamage.gameplay.js";
import { calculateType } from "./basical/formulas/calculateType.gameplay.js";
import { calculateVariableDamage } from "./variable/calculateVariableDamage.gameplay.js";

export const calculateMoveDamages = (action, CC, weather) => {
  let damages = null;
  const target = action.target;
  const TYPE1 = calculateType(action, target.types[0]);
  const TYPE2 = calculateType(action, target.types[1]);

  const getBasicDamages = calculateBasicDamage(action, CC, weather);
  const getVariableDamages = calculateVariableDamage(action);

  getVariableDamages
    ? (damages = getVariableDamages)
    : (damages = getBasicDamages);

  return {
    basicDamage: getBasicDamages,
    variableDamage: getVariableDamages,
    damages,
    efficiencies: { TYPE1, TYPE2 },
  };
};

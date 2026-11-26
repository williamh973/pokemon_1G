import { calculateBasicDamage } from "./basical/formulas/calculateBasicDamage.gameplay.js";
import { calculateType } from "./basical/formulas/calculateType.gameplay.js";
import { calculateSpecialDamage } from "./variable/calculateSpecialDamage.gameplay.js";

export const calculateMoveDamages = (action, CC, weather) => {
  let damages = null;
  let wasHitByOHKO = false;

  const target = action.target;

  const OHKO = action.move.effect?.type === "OHKO";

  const TYPE1 = calculateType(action, target.types[0]);
  const TYPE2 = calculateType(action, target.types[1]);

  const getBasicDamages = calculateBasicDamage(action, CC, weather);
  const getSpecialDamages = calculateSpecialDamage(action);

  getSpecialDamages
    ? (damages = getSpecialDamages)
    : (damages = getBasicDamages / 4);

  if (OHKO) {
    wasHitByOHKO = true;
    damages = target.stats.hp;
  }

  return {
    basicDamage: getBasicDamages,
    variableDamage: getSpecialDamages,
    damages,
    efficiencies: { TYPE1, TYPE2 },
    wasHitByOHKO,
  };
};

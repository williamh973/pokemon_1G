export const EARTHPOWER_MOVE = {
  id: "earthpower",
  name: "Telluriforce",
  type: ["GROUND"],
  class: ["SPECIAL"],
  pp: 10,
  power: 90,
  precision: 100,
  desc: "De terribles séismes secouent l'ennemi. Peut aussi baisser sa Défense Spéciale.",

  effect: {
    type: "STAT_STAGE",
    stat: ["specialDef"],
    amount: 1,
    percentage: 10,
  },
};

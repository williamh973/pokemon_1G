export const UPPERCUT_MOVE = {
  id: "uppercut",
  name: "Uppercut",
  type: ["NORMAL"],
  class: ["PHYSICAL"],
  pp: 20,
  power: 65,
  precision: 100,
  desc: "Uppercut inflige des dégâts et a 20% de chances de rendre la cible confuse.",

  effect: {
    type: "VOLATILE",
    volatile: "CONFUSION",
    percentage: 20,
  },
};

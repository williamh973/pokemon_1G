export const GIGADRAIN_MOVE = {
  id: "gigaDrain",
  name: "Giga-Sangsue",
  type: ["GRASS"],
  class: ["SPECIAL"],
  pp: 10,
  power: 75,
  precision: 100,
  desc: "Une attaque qui convertit la moitié des dégâts infligés en PV pour le lanceur.",

  effect: {
    type: "DRAIN",
    stat: "hp",
    amount: 50,
    percentage: 100,
  },
};

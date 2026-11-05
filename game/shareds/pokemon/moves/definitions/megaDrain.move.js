export const MEGADRAIN_MOVE = {
  id: "megaDrain",
  name: "Méga-Sangsue",
  type: ["GRASS"],
  class: ["SPECIAL"],
  pp: 15,
  power: 40,
  precision: 100,
  desc: "Une attaque qui convertit la moitié des dégâts infligés en PV pour le lanceur.",

  effect: {
    type: "DRAIN",
    stat: "hp",
    amount: 50,
    percentage: 100,
  },
};

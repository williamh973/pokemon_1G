export const ABSORB_MOVE = {
  id: "absorb",
  name: "Vol-Vie",
  type: ["GRASS"],
  class: ["SPECIAL"],
  pp: 25,
  power: 20,
  precision: 100,
  desc: "Une attaque qui convertit la moitié des dégâts infligés en PV pour le lanceur.",

  effect: {
    type: "DRAIN",
    stat: "hp",
    amount: 50,
    percentage: 100,
  },
};

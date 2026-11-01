export const LEECHLIFE_MOVE = {
  id: "leechLife",
  name: "Vampirisme",
  type: ["BUG"],
  class: ["PHYSICAL"],
  pp: 15,
  power: 20,
  precision: 100,
  desc: "Convertit 50% des dégâts infligés à la cible en PV pour le lanceur.",

  effect: {
    type: "DRAIN",
    stat: "hp",
    amount: 50,
    percentage: 100,
  },
};

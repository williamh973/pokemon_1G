export const DOUBLESLAP_MOVE = {
  id: "doubleSlap",
  name: "Torgnoles",
  type: ["NORMAL"],
  class: ["PHYSICAL"],
  pp: 10,
  power: 15,
  precision: 85,
  desc: "Frappe l'ennemi deux à cinq fois d'affilée avec un bec ou une corne, par exemple.",

  effect: {
    type: "MULTI_HIT",
    minCount: 2,
    maxCount: 5,
  },
};

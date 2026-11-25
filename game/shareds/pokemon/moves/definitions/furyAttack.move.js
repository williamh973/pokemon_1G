export const FURYATTACK_MOVE = {
  id: "furyAttack",
  name: "Furie",
  type: ["NORMAL"],
  class: ["PHYSICAL"],
  pp: 20,
  power: 15,
  precision: 85,
  desc: "Frappe l'ennemi deux à cinq fois d'affilée avec un bec ou une corne, par exemple.",

  effect: {
    type: "MULTI_HIT",
    minCount: 2,
    maxCount: 5,
  },
};

export const STRINGSHOT_MOVE = {
  id: "stringShot",
  name: "Sécrétion",
  type: ["BUG"],
  class: ["SPECIAL"],
  pp: 40,
  power: 0,
  precision: 100,
  desc: "Le lanceur crache de la soie pour ligoter l'ennemi et beaucoup baisser sa Vitesse.",

  effect: {
    type: "STAT_STAGE",
    stat: "speed",
    amount: -1,
    percentage: 100,
  },
};

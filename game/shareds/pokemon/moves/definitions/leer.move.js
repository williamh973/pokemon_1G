export const LEER_MOVE = {
  id: "leer",
  name: "Groz'Yeux",
  type: ["NORMAL"],
  class: ["STATUT"],
  pp: 30,
  power: 0,
  precision: 100,
  desc: "Le lanceur fait les gros yeux à l'ennemi pour l'intimider et baisser sa Défense.",

  effect: {
    type: "STAT_STAGE",
    stat: "defense",
    amount: -1,
    percentage: 100,
  },
};

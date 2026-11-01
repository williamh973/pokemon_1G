export const ACID_MOVE = {
  id: "acid",
  name: "Acide",
  type: ["POISON"],
  class: ["PHYSICAL"],
  pp: 30,
  power: 40,
  precision: 100,
  desc: "33.2% de chance de baisser la Défense des cibles d'un niveau.",

  effect: {
    type: "STAT_STAGE",
    stat: "defense",
    amount: -1,
    percentage: 100,
  },
};

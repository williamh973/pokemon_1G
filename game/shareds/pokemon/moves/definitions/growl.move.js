export const GROWL_MOVE = {
  id: "growl",
  name: "Rugissement",
  type: ["NORMAL"],
  class: ["STATUT"],
  pp: 40,
  power: 0,
  precision: 100,
  desc: "Attaque sonore. Baisse l'Attaque.",

  effect: {
    type: "STAT_STAGE",
    stat: "attack",
    amount: -1,
    percentage: 100,
  },
};

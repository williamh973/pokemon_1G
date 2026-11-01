export const SCREECH_MOVE = {
  id: "screech",
  name: "Grincement",
  type: ["NORMAL"],
  class: ["STATUT"],
  pp: 40,
  power: 0,
  precision: 85,
  desc: "Attaque sonore. Baisse la Défense de la cible de 2 niveaux.",

  effect: {
    type: "STAT_STAGE",
    stat: "defense",
    amount: -2,
    percentage: 100,
  },
};

export const BARRIER_MOVE = {
  id: "barrier",
  name: "Bouclier",
  type: ["PSYCHIC"],
  class: ["STATUT"],
  pp: 20,
  power: 0,
  precision: 100,
  desc: "Bouclier augmente la Défense de deux niveaux.",
  selfTarget: true,

  effect: {
    type: "STAT_STAGE",
    stat: "defense",
    amount: 2,
    percentage: 100,
  },
};

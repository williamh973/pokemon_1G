export const POISONGAS_MOVE = {
  id: "poisonGas",
  name: "Gaz Toxik",
  type: ["POISON"],
  class: ["STATUT"],
  pp: 40,
  power: 0,
  precision: 55,
  desc: "Un nuage de gaz toxique est projeté au visage de l'ennemi pour l'empoisonner.",

  effect: {
    type: "STATUS",
    status: "POISON",
    percentage: 100,
  },
};

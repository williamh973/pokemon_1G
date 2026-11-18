export const POISONPOWDER_MOVE = {
  id: "poisonPowder",
  name: "Poudre Toxik",
  type: ["POISON"],
  class: ["STATUS"],
  pp: 35,
  power: 0,
  precision: 75,
  desc: "Une poudre toxique empoisonne l'ennemi.",

  effect: {
    type: "STATUS",
    status: "POISON",
    percentage: 100,
  },
};

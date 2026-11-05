export const SLUDGE_MOVE = {
  id: "sludge",
  name: "Détritus",
  type: ["POISON"],
  class: ["SPECIAL"],
  pp: 20,
  power: 65,
  precision: 100,
  desc: "Des détritus toxiques sont projetés sur la cible, ce qui peut aussi l'empoisonner.",

  effect: {
    type: "STATUS",
    status: "poison",
    percentage: 30,
  },
};

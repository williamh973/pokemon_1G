export const POISONSTING_MOVE = {
  id: "poisonSting",
  name: "Dard-Venin",
  type: ["POISON"],
  class: ["PHYSICAL"],
  pp: 35,
  power: 15,
  precision: 100,
  desc: "Un dard toxique qui transperce l'ennemi. Peut aussi l'empoisonner.",

  effect: {
    type: "STATUS",
    status: "POISON",
    percentage: 30,
  },
};

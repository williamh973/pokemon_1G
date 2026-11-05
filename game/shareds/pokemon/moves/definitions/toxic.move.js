export const TOXIC_MOVE = {
  id: "toxic",
  name: "Toxic",
  type: ["POISON"],
  class: ["STATUS"],
  pp: 10,
  power: 0,
  precision: 85,
  desc: "Empoisonne gravement l'ennemi. Les dégâts dus au poison augmentent à chaque tour.",

  effect: {
    type: "STATUS",
    status: "POISON",
    percentage: 100,
  },
};

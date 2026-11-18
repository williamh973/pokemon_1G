export const STUNSPORE_MOVE = {
  id: "stunSpore",
  name: "Para-Spore",
  type: ["GRASS"],
  class: ["STATUS"],
  pp: 30,
  power: 0,
  precision: 75,
  desc: "Le lanceur répand sur l'ennemi une poudre qui le paralyse.",

  effect: {
    type: "STATUS",
    status: "PARALYSIS",
    percentage: 100,
  },
};

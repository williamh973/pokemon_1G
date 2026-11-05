export const THUNDER_MOVE = {
  id: "thunder",
  name: "Fatal-Foudre",
  type: ["ELECTRIK"],
  class: ["SPECIAL"],
  pp: 10,
  power: 110,
  precision: 70,
  desc: "La foudre tombe sur l'ennemi pour lui infliger des dégâts. Peut aussi le paralyser.",

  effect: {
    type: "STATUS",
    status: "PARALYSIS",
    percentage: 10,
  },
};

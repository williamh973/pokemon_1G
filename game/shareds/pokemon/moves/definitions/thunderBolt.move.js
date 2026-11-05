export const THUNDERBOLT_MOVE = {
  id: "thunderBolt",
  name: "Tonnerre",
  type: ["ELECTRIK"],
  class: ["SPECIAL"],
  pp: 15,
  power: 95,
  precision: 100,
  desc: "Une grosse décharge électrique tombe sur l'ennemi. Peut aussi le paralyser.",

  effect: {
    type: "STATUS",
    status: "PARALYSIS",
    percentage: 10,
  },
};

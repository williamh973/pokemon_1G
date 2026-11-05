export const THUNDERSHOCK_MOVE = {
  id: "thundershock",
  name: "Éclair",
  type: ["ELECTRIK"],
  class: ["SPECIAL"],
  pp: 30,
  power: 40,
  precision: 100,
  desc: "Une décharge électrique tombe sur l'ennemi. Peut aussi le paralyser.",

  effect: {
    type: "STATUS",
    status: "PARALYSIS",
    percentage: 10,
  },
};

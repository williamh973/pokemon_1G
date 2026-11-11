export const THUNDERPUNCH_MOVE = {
  id: "thunderPunch",
  name: "Poing Éclair",
  type: ["ELECTRIK"],
  class: ["PHYSICAL"],
  pp: 15,
  power: 75,
  precision: 100,
  desc: "Un coup de poing électrique vient frapper l'ennemi. Peut le paralyser.",

  effect: {
    type: "STATUS",
    status: "PARALYSIS",
    percentage: 10,
  },
};

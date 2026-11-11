export const ICEPUNCH_MOVE = {
  id: "icePunch",
  name: "Poing-Glace",
  type: ["ICE"],
  class: ["PHYSICAL"],
  pp: 15,
  power: 75,
  precision: 100,
  desc: "Un coup de poing glacé vient frapper l'ennemi. Peut le geler.",

  effect: {
    type: "STATUS",
    status: "FREEZE",
    percentage: 10,
  },
};

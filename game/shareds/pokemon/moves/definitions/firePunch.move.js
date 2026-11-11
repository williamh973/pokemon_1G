export const FIREPUNCH_MOVE = {
  id: "firePunch",
  name: "Poing de Feu",
  type: ["FIRE"],
  class: ["PHYSICAL"],
  pp: 15,
  power: 75,
  precision: 100,
  desc: "Un coup de poing enflammé vient frapper l'ennemi. Peut le brûler.",

  effect: {
    type: "STATUS",
    status: "BURN",
    percentage: 10,
  },
};

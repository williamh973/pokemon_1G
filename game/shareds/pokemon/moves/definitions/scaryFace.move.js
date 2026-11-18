export const SCARYFACE_MOVE = {
  id: "scaryFace",
  name: "Intimidation",
  type: ["NORMAL"],
  class: ["STATUT"],
  pp: 30,
  power: 0,
  precision: 75,
  desc: "Le lanceur intimide l'ennemi grâce à son regard terrifiant pour le paralyser.",

  effect: {
    type: "STATUS",
    status: "PARALYSIS",
    percentage: 100,
  },
};

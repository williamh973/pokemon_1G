export const IRONDEFENSE_MOVE = {
  id: "irondefense",
  name: "Mur de Fer",
  type: ["STEEL"],
  class: ["STATUT"],
  pp: 15,
  power: 0,
  precision: 100,
  desc: "L'épiderme du lanceur devient dur comme du fer, ce qui augmente beaucoup sa Défense.",
  selfTarget: true,

  effect: {
    type: "STAT_STAGE",
    stat: "defense",
    amount: 2,
    percentage: 100,
  },
};

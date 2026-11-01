export const HARDEN_MOVE = {
  id: "harden",
  name: "Armure",
  type: ["NORMAL"],
  class: ["STATUT"],
  pp: 30,
  power: 0,
  precision: 100,
  desc: "Augmente la Défense du lanceur d'un niveau.",
  selfTarget: true,

  effect: {
    type: "STAT_STAGE",
    stat: "defense",
    amount: 1,
    percentage: 100,
  },
};

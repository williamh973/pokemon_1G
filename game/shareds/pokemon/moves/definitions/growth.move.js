export const GROWTH_MOVE = {
  id: "growth",
  name: "Croissance",
  type: ["GRASS"],
  class: ["STATUT"],
  pp: 20,
  power: 0,
  precision: 100,
  desc: "Le corps du lanceur se développe. Augmente l'Attaque et l'Attaque Spéciale.",
  selfTarget: true,

  effect: {
    type: "STAT_STAGE",
    stat: ["attack", "specialAtt"],
    amount: 1,
    percentage: 100,
  },
};

export const FOCUS_ENERGY_MOVE = {
  id: "focusEnergy",
  name: "Puissance",
  type: ["NORMAL"],
  class: ["STATUT"],
  pp: 30,
  power: 0,
  precision: 100,
  desc: "augmente les chances de coups critiques.",
  effect: {
    type: "VOLATILE",
    volatile: "FOCUS_ENERGY",
    percentage: 100,
  },
};

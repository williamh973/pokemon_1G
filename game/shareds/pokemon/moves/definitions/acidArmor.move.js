export const ACIDARMOR_MOVE = {
  id: "acidArmor",
  name: "Acidarmure",
  type: ["POISON"],
  class: ["STATUS"],
  pp: 20,
  power: 0,
  precision: 100,
  desc: "Le lanceur modifie sa structure moléculaire pour se liquéfier et beaucoup augmenter sa Défense.",
  selfTarget: true,

  effect: {
    type: "STAT_STAGE",
    stat: "defense",
    amount: 2,
    percentage: 100,
  },
};

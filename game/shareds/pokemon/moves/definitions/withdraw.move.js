export const WITHDRAW_MOVE = {
  id: "withdraw",
  name: "Repli",
  type: ["WATER"],
  class: ["STATUT"],
  pp: 40,
  power: 0,
  precision: 100,
  desc: "Le lanceur se recroqueville dans sa carapace, ce qui augmente sa Défense.",
  selfTarget: true,

  effect: {
    type: "STAT_STAGE",
    stat: "defense",
    amount: 1,
    percentage: 100,
  },
};

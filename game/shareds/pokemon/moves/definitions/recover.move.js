export const RECOVER_MOVE = {
  id: "recover",
  name: "Soin",
  type: ["NORMAL"],
  class: ["STATUT"],
  pp: 5,
  power: 0,
  precision: 100,
  desc: "Le lanceur se soigne en régénérant ses cellules afin de récupérer des PV.",

  effect: {
    type: "DRAIN",
    stat: "hp",
    amount: 50,
    percentage: 100,
  },
};
